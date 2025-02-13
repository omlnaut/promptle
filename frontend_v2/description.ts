// https://omlnautpromptle.azurewebsites.net/api/DescribeImage

interface DescriptionResponse {
    words: string[];
}

export function describeImage(imageUrl: string): Promise<DescriptionResponse> {

    const url = getBackendUrl();
    return fetch(url, {
        method: "POST",
        body: JSON.stringify({ imageUrl: imageUrl }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json());
}

function getBackendUrl() {
    // Check if we're running locally
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '';

    return isLocalhost
        ? 'http://localhost:7071/api/DescribeImage'
        : 'https://omlnautpromptle.azurewebsites.net/api/DescribeImage';
}