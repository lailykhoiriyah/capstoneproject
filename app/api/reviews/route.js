import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/db";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      destination_id, 
      destination_name, 
      review_text, 
      ai_label, 
      ai_confidence 
    } = await req.json();

    // Get internal user ID from email using Supabase SDK
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .ilike('email', session.user.email)
      .single();

    if (userError || !userData) {
      console.error("User not found for email:", session.user.email, "Error:", userError);
      return NextResponse.json({ 
        error: "User not found",
        details: `Email ${session.user.email} tidak ditemukan di tabel 'users'.`,
        hint: "PENTING: Pastikan RLS (Row Level Security) untuk TABEL 'users' sudah dinonaktifkan di Supabase SQL Editor dengan menjalankan: ALTER TABLE users DISABLE ROW LEVEL SECURITY;"
      }, { status: 404 });
    }

    const userId = userData.id;

    // Insert review into Supabase
   const { data: reviewData, error:insertError } = await supabase
  .from('reviews')
  .insert([
    {
      user_id: userId,
      destination_id,
      destination_name,
      review_text,
      ai_label,
      ai_confidence,
      photo_url
    }
  ])
  .select()
  .single();

    if (insertError) {
      console.error("Error saving review to Supabase:", insertError);
      return NextResponse.json({ 
        error: "Failed to save review", 
        details: insertError.message,
        hint: "Pastikan RLS (Row Level Security) untuk tabel 'reviews' sudah dinonaktifkan atau diizinkan untuk INSERT."
      }, { status: 500 });
    }

    return NextResponse.json(reviewData, { status: 201 });
  } catch (error) {
    console.error("Internal review error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
