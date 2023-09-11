
    export async function load({ fetch }) {
        const { next, items, total } = await fetch(`api/me/tracks?limit=4`, {
            credentials: 'include'
        }).then(r => r.json())
        return {
            props: {
                songs: items,
                next,
                total
            }
        }
    }