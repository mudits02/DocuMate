import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#0d1321] text-[#dde2f6] px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="bg-[#151b2a] rounded-2xl border border-[#242a39] p-8 shadow-2xl">
          <p className="text-[#00dfc1] uppercase tracking-[0.3em] text-xs mb-3">
            Authenticated Session
          </p>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#2a3245] bg-[#0d1321]">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name ?? "User avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#00dfc1]">
                    {user?.name?.[0] ?? "D"}
                  </div>
                )}
              </div>

              <div>
                <h1 className="font-['Space_Grotesk'] text-4xl font-bold mb-2">
                  {user?.name ? `Welcome, ${user.name}` : "Welcome to Documate"}
                </h1>
                <p className="text-[#c6c6cc]">
                  Signed in as {user?.email ?? "unknown user"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
            <p className="text-sm text-[#00dfc1] mb-2">Name</p>
            <p className="text-sm text-[#c6c6cc] wrap-break-word">
              {user?.name ?? "Unavailable"}
            </p>
          </article>

          <article className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
            <p className="text-sm text-[#00dfc1] mb-2">Email</p>
            <p className="text-sm text-[#c6c6cc] wrap-break-word">
              {user?.email ?? "Unavailable"}
            </p>
          </article>

          <article className="bg-[#111827] border border-[#1f2937] rounded-xl p-5">
            <p className="text-sm text-[#00dfc1] mb-2">Provider</p>
            <p className="text-sm text-[#c6c6cc] capitalize">
              {user?.provider ?? "Unavailable"}
            </p>
          </article>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
