import type {InferGetStaticPropsType, GetStaticProps} from 'next'

async function getData() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        return res.json()
    }catch (e) {
        console.log('---e---', e)
    }
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    let res = {'ok': true, 'users': {'name': 'ALex', 'id': 4}};
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data.1')
    }

    return res.users
}


export default async function Rating() {
    const users = await getData()
    return (
        <div className="Rating">
            <h2>Rating</h2>
            <table>
                <tbody>
                {users.map((user: any) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ul></ul>
        </div>
    );
}




