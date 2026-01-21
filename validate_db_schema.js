const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = 'https://lxmwsnfszwoqzqwsryvb.supabase.co';
// User provided secret.
const SUPABASE_KEY = 'sb_secret_kUZ_6rqJX67HSwxslteDvA_XZg7Ud2I';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

async function validateSchema() {
    console.log('Checking column types for transacoes table...');

    try {
        const { data, error } = await supabase.rpc('execute_sql', {
            query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'transacoes';"
        });

        // If RPC fails (likely due to permissions or missing function), try a direct select if possible (unlikely for info schema via client)
        // Actually, let's try a direct query if the user has a function exposed, OR just try to select * from transacoes limit 1 and infer?
        // No, let's try to infer from an error message or just assume the previous hypothesis.
        // Wait, I can't call execute_sql unless exposed.

        // usage of 'rpc' depends on 'execute_sql' existing.
        // Let's TRY to INSERT a dummy record with a UUID to FORCE the specific error and see which column complains?
        // No, that's dangerous.

        // Let's try to fetch one row.
        const { data: rows, error: selectError } = await supabase
            .from('transacoes')
            .select('*')
            .limit(1);

        if (selectError) {
            console.log('Error selecting:', selectError);
        } else if (rows && rows.length > 0) {
            const row = rows[0];
            console.log('Sample Row:', row);
            console.log('Type of usuario_id:', typeof row.usuario_id);
            console.log('Type of conta_id:', typeof row.conta_id);
        } else {
            console.log('No rows found to infer types.');
        }

    } catch (err) {
        console.log('Exception:', err.message);
    }
}

validateSchema();
