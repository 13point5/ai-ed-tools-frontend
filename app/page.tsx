import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Home = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="w-screen p-8 flex flex-col gap-4 items-center">
      <h1 className="text-4xl font-bold">AI Ed Tools</h1>

      <p className="text-center text-md text-muted-foreground">
        Truly Personalised AI tools for your students.
      </p>

      <div className="space-x-4">
        <Button>
          <Link href="/signin">Sign In</Link>
        </Button>

        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    </main>
  );
};

export default Home;
