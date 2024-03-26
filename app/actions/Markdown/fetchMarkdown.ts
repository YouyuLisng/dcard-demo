async function fetchMarkdown(username: string, repo: string) {
    try {
        const headers = new Headers();
        headers.append('Accept', 'application/vnd.github.v3+json');

        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/readme`, {
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data; // Return the response data
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

export default fetchMarkdown;
