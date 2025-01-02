import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";

export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for dynamic routes
export async function generateStaticParams() {
  const query = `*[_type=='post']{ "slug": slug.current }`;
  const slugs = await client.fetch(query);
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }));
}

// Page component
export default async function Page({ params }: { params: { slug: string } }) {
  const query = `*[_type=='post' && slug.current == $slug]{
    title, summary, image, content,
    author->{bio, image, name}
  }[0]`;

  const post = await client.fetch(query, { slug: params.slug });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="mt-12 mb-24 px-2 flex flex-col gap-y-8">
      {/* Blog Title */}
      <h1 className="text-3xl font-bold text-center">{post.title}</h1>

      {/* Featured Image */}
      {post.image && (
        <Image
          src={urlForImage(post.image)}
          width={500}
          height={500}
          alt={post.title}
          className="rounded mx-auto"
        />
      )}

      {/* Blog Summary */}
      <section>
        <h2 className="text-2xl font-bold underline">Summary</h2>
        <p>{post.summary}</p>
      </section>

      {/* Blog Content */}
      <section>
        <PortableText value={post.content} />
      </section>

      {/* Author Section */}
      {post.author && (
        <section className="flex items-center gap-4">
          {post.author.image && (
            <Image
              src={urlForImage(post.author.image)}
              width={50}
              height={50}
              alt={post.author.name}
              className="rounded-full"
            />
          )}
          <div>
            <h3 className="font-bold">{post.author.name}</h3>
            <p>{post.author.bio}</p>
          </div>
        </section>
      )}
    </article>
  );
}
