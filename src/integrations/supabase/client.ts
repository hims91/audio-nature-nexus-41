
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dglhceyrwrqwoiahibyj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbGhjZXlyd3Jxd29pYWhpYnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTk2NTMsImV4cCI6MjA2NTIzNTY1M30.5niZPcgOxCOK925f2-ZXQW25lgceJRyAHcnsK2EeIJs"

export const supabase = createClient(supabaseUrl, supabaseKey)
