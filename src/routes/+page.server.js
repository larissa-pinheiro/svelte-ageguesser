export const load = async ({ url, fetch }) => {
    const name = url.searchParams.get('name')?.trim();
    
    if (!name) return { data: null };
    
    try {
        const response = await fetch(`https://api.agify.io?name=${encodeURIComponent(name)}`);
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        return { data };
    } catch (error) {
        console.error("API Error:", error);
        return { data: { error: "Failed to fetch age data" } };
    }
};