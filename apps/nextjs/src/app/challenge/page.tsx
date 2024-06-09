

export const runtime = "edge";
import Link from 'next/link'
export default function ChallengePage() {
  return (
    <main className="container max-h-screen py-16">
        <ul>
            <li>
                <Link href="/reaction">Home</Link>
            </li>
            <li>
                <Link href="/about">About Us</Link>
            </li>
            <li>
                <Link href="/blog/hello-world">Blog Post</Link>
            </li>
        </ul>

    </main>
  );
}
