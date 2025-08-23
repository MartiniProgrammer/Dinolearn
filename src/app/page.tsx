export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-8">
      <h2 className="text-4xl font-bold text-green-600">Welkom bij DinoLearn 🦖</h2>
      <p className="text-lg text-gray-700">Korte lessen • Gamified • Wetenschappelijk</p>
      <a
        href="/courses"
        className="px-6 py-3 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600"
      >
        View all courses!
      </a>
    </div>
  );
}
