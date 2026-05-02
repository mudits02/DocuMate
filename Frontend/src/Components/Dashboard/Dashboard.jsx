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

            <div className="rounded-2xl border border-[#242a39] bg-[#111827] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#909096] mb-2">
                Auth Provider
              </p>
              <p className="font-['Space_Grotesk'] text-xl capitalize text-[#00dfc1]">
                {user?.provider ?? "unknown"}
              </p>
            </div>
          </div>
        </section>

        {(user?.provider === "github" || user?.github_user) && (
          <section className="bg-[#151b2a] rounded-2xl border border-[#242a39] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#00dfc1] uppercase tracking-[0.3em] text-xs mb-2">
                  GitHub Repositories
                </p>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold">
                  Your repositories
                </h2>
              </div>
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

            <div className="grid gap-4">
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
