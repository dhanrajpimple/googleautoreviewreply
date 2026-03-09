export async function fetchGoogleReviews(accountId: string, locationId: string, accessToken: string) {
    const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch Reviews Error:', errorText);
        throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.reviews || [];
}
