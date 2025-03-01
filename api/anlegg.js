import { createClient } from '@supabase/supabase-js';

console.log("Starter API...");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Feil: Supabase-miljøvariabler mangler!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    console.log("API-anrop mottatt:", req.method);

    if (req.method === "GET") {
        console.log("Henter anlegg fra Supabase...");
        const { data, error } = await supabase.from("anlegg").select("*");

        if (error) {
            console.error("Feil ved henting fra Supabase:", error.message);
            return res.status(500).json({ error: error.message });
        }
        console.log("Data hentet:", data);
        return res.status(200).json(data);
    }

    if (req.method === "POST") {
        console.log("Mottatt POST-request:", req.body);
        const { name, lat, lon, status, effekt } = req.body;

        if (!name || !lat || !lon || !status || effekt === undefined) {
            console.error("Feil: Manglende felter i request.");
            return res.status(400).json({ error: "Alle feltene må fylles ut" });
        }

        const { data, error } = await supabase.from("anlegg").insert([{ name, lat, lon, status, effekt }]);

        if (error) {
            console.error("Feil ved lagring i Supabase:", error.message);
            return res.status(500).json({ error: error.message });
        }

        console.log("Anlegg lagret:", data);
        return res.status(201).json(data);
    }

    console.error("Feil: Metode ikke tillatt.");
    return res.status(405).end();
}
