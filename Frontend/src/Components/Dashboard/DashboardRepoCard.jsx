const DashboardRepoCard = ({ repo }) => {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-[#1f2937] bg-[#111827] p-5 hover:border-[#00dfc1]/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-[#dde2f6]">{repo.name}</p>
          <p className="text-sm text-[#909096]">{repo.full_name}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            repo.private
              ? "bg-[#3a1111] text-red-300"
              : "bg-[#0f2d24] text-[#00dfc1]"
          }`}
        >
          {repo.private ? "Private" : "Public"}
        </span>
      </div>
    </a>
  );
};

export default DashboardRepoCard;
