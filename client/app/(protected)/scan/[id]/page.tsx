export default async function ScanPage({ params }) {

    const res = await fetch(
        `http://localhost:3000/api/scans/${params.id}`,
        { cache: "no-store" }
    );

    const scan = await res.json();

    return (
        <div>

            <img src={scan.previewUrl} />

            <h1>{scan.name}</h1>

            <p>{scan.result.summary}</p>

        </div>
    );
}
