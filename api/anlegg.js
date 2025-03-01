import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: "Supabase miljøvariabler mangler" });
    }

    if (req.method === "GET") {
        const { data, error } = await supabase.from("anlegg").select("*");
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }
    if (req.method === "POST") {
        const { name, lat, lon, status, effekt } = req.body;
        if (!name || !lat || !lon || !status || effekt === undefined) {
            return res.status(400).json({ error: "Alle feltene må fylles ut" });
        }
        const { data, error } = await supabase.from("anlegg").insert([{ name, lat, lon, status, effekt }]);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    }
    return res.status(405).end();
}
