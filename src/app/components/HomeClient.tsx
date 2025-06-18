"use client";

type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type HomeClientProps = {
  user: User;
};

export default function HomeClient({ user }: HomeClientProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our App</h1>
      <p className="text-lg mb-4">This is a client-side rendered component.</p>
      {/* Example of using the user prop */}
      {user?.name && <p className="text-xl mb-2">Hello, {user.name}!</p>}
      <p className="text-sm text-gray-600">
        You can add more functionality here.
      </p>
    </div>
  );
}

//Finish Habit Frontend
//basic scaffold for front end
//closing
//antipatterns
//
