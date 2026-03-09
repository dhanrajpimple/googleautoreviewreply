export async function postGoogleReply(
    accountId: string,
    locationId: string,
    reviewId: string,
    message: string,
    accessToken: string
) {
    const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            comment: message,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Post Reply Error:', errorText);
        throw new Error(`Failed to post reply: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}
