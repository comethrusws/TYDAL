import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

const getSongs = async(): Promise<Song[]> =>{
    const supabase = createServerComponentClient
}