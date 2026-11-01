import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rptnhtdxakybnzgsrcpp.supabase.co'
const supabaseKey = 'sb_publishable_MnPNhmx1QHgg8igchAEYeQ_p5ltfYvE'

export const supabase = createClient(supabaseUrl, supabaseKey)