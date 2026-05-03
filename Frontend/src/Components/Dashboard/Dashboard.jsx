import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReposForGithubUser } from "../../Redux/Slice/authActions.jsx";
import DashboardRepoCard from "./DashboardRepoCard.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, repos, reposLoading, reposError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.provider === "github" || user?.github_user) {
      dispatch(fetchReposForGithubUser());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-[#0d1321] text-[#dde2f6]">
      <div className="w-full space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-[#242a39] bg-[linear-gradient(135deg,#151b2a_0%,#101726_65%,#0d1321_100%)] p-8 shadow-2xl md:p-10">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(0,223,193,0.14),transparent_55%)]" />
          <p className="relative text-[#00dfc1] uppercase tracking-[0.3em] text-xs mb-4">
            Authenticated Session
          </p>

          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-24 w-24 overflow-hidden rounded-3xl border border-[#2a3245] bg-[#0d1321] shadow-lg shadow-black/20">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name ?? "User avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#00dfc1]">
                    {user?.name?.[0] ?? "D"}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="font-['Space_Grotesk'] text-4xl font-bold mb-3 tracking-tight sm:text-5xl">
                  {user?.name ? `Welcome, ${user.name}` : "Welcome to Documate"}
                </h1>
                <p className="text-[#c6c6cc] text-base sm:text-lg break-all">
                  Signed in as {user?.email ?? "unknown user"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:min-w-115">
              <div className="rounded-2xl border border-[#242a39] bg-[#111827]/80 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.25em] text-[#909096] mb-2">
                  Auth Provider
                </p>
                <p className="font-['Space_Grotesk'] text-xl capitalize text-[#00dfc1]">
                  {user?.provider ?? "unknown"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#242a39] bg-[#111827]/80 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.25em] text-[#909096] mb-2">
                  Account Status
                </p>
                <p className="font-['Space_Grotesk'] text-xl text-[#dde2f6]">
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {(user?.provider === "github" || user?.github_user) && (
          <section className="rounded-[28px] border border-[#242a39] bg-[#151b2a] p-8 shadow-2xl md:p-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <p className="text-[#00dfc1] uppercase tracking-[0.3em] text-xs mb-2">
                  GitHub Repositories
                </p>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold sm:text-3xl">
                  Your repositories
                </h2>
                <p className="mt-2 text-sm text-[#909096]">
                  Explore connected repositories and inspect what is available before deeper drill-down views.
                </p>
              </div>

              {!reposLoading && !reposError && repos.length > 0 && (
                <div className="inline-flex w-fit items-center rounded-full border border-[#223046] bg-[#111827] px-4 py-2 text-sm text-[#c6c6cc]">
                  {repos.length} repos synced
                </div>
              )}
            </div>

            {reposLoading && (
              <p className="text-[#c6c6cc]">Loading repositories...</p>
            )}

            {reposError && (
              <p className="text-red-400">{reposError}</p>
            )}

            {!reposLoading && !reposError && repos.length === 0 && (
              <p className="text-[#c6c6cc]">No repositories found.</p>
            )}

            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {repos.map((repo) => (
                <DashboardRepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
