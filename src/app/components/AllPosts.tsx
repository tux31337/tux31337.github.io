import { getAllPosts, Post } from "@/api/posts";
import Link from "next/link";

export default async function AllPosts() {
  const posts = await getAllPosts();

  return (
    <ul>
      {posts.map((post: Post) => {
        const path = post.path;

        return (
          <Link href={`/posts/${path}`}>
            <li>{post.title}</li>
          </Link>
        );
      })}
    </ul>
  );
}
