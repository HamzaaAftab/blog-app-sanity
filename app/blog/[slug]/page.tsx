import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";

export const revalidate = 60; // Revalidate every 60 seconds

// Generate static paths for dynamic routes
export async function generateStaticParams() {
  const query = `*[_type == "post"] {
    "slug": slug.current
  }`;

  const slugs = await client.fetch(query);

  // Return the params in the correct structure
  return slugs.map((item: { slug: string }) => ({
    params: { slug: item.slug },
  }));
}

// To create static pages for dynamic routes
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch the post data based on the slug
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title, summary, image, content,
    author->{bio, image, name}
  }`;

  const post = await client.fetch(query, { slug });

  // If the post is not found, render a fallback message
  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <article className="mt-12 mb-24 px-2 2xl:px-12 flex flex-col gap-y-8">
      {/* Blog Title */}
      <h1 className="text-xl xs:text-3xl text-center lg:text-5xl font-bold text-dark dark:text-light">
        {post.title}
      </h1>

      {/* Featured Image */}
      <Image
        src={urlForImage(post.image)}
        width={500}
        height={500}
        alt={post.title || "Featured Image"}
        className="rounded mx-auto"
      />

      {/* Blog Summary Section */}
      <section>
        <h2 className="text-xl py-4 xs:text-2xl underline md:text-4xl font-extrabold uppercase text-accentDarkPrimary">
          Caption
        </h2>
        <p className="text-xl md:text-xl leading-relaxed text-justify text-dark/80 dark:text-light/80">
          {post.summary}
        </p>
      </section>

      {/* Main Body of Blog */}
      <section
        className="text-lg leading-normal text-dark/80 dark:text-light/80
        prose-h4:text-accentDarkPrimary prose-h4:text-3xl prose-h4:font-bold
        prose-li:list-disc prose-li:list-inside prose-li:marker:text-accentDarkSecondary
        prose-strong:text-dark dark:prose-strong:text-white"
      >
        <PortableText value={post.content} />
      </section>

      {/* Author Section */}
      <section className="px-2 sm:px-8 md:px-12 flex gap-2 xs:gap-4 sm:gap-6 items-start xs:items-center justify-start">
        <Image
          src={urlForImage(post.author.image)}
          width={200}
          height={200}
          alt={post.author.name || "Author"}
          className="object-cover rounded-full h-12 w-12 sm:h-24 sm:w-24"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-dark dark:text-light">
            {post.author.name}
          </h3>
          <p className="italic text-xs xs:text-sm sm:text-base text-dark/80 dark:text-light/80">
            {post.author.bio}
          </p>
        </div>
      </section>
    </article>
  );
}
