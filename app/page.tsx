export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* images carousel  */}
      <div className="w-full aspect-[16/4] bg-gray-100 rounded-2xl"></div>

      <section className="mt-12 flex flex-col gap-4">
        {/* search and category filter */}
        <div className="flex gap-2">
          {/* todo add search filed */}
          <div className="flex-1 h-11 rounded-full bg-gray-100"></div>
          {/* todo add dropdown category */}
          <div className="h-11 w-32 rounded-full bg-gray-100"></div>
        </div>

        {/* products cards */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="aspect-square rounded-2xl bg-gray-100"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-12 rounded-full bg-gray-100"></div>
                <div className="h-4 w-32 rounded-full bg-gray-100"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
