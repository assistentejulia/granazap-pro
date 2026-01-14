
// Use standard require to ensure compatibility
const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = 'https://lxmwsnfszwoqzqwsryvb.supabase.co';
// User provided secret.
const SUPABASE_KEY = 'sb_secret_kUZ_6rqJX67HSwxslteDvA_XZg7Ud2I';

// Initialize client with some options to avoid fetch/dns issues if possible
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

async function validateSchema() {
    console.log('Testing connection with provided key...');

    try {
        // Attempt 1: Select specifically the missing column
        // calculated column or just selecting it
        const { data, error } = await supabase
            .from('metas_orcamento')
            .select('tipo_conta')
            .limit(1);

        if (error) {
            console.log('Validation Result: ERROR FOUND');
            console.log('Error Message:', error.message);

            if (error.code) console.log('Error Code:', error.code);

        } else {
            console.log('Validation Result: SUCCESS - Column exists or query succeeded.');
            console.log('Data sample:', JSON.stringify(data));
        }

    } catch (err) {
        console.log('System Exception:', err.message);
    }
}

validateSchema();
