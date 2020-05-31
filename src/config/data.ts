export const protection = {
  required_status_checks: {
    strict: true,
    contexts: [],
  },
  enforce_admins: false,
  required_pull_request_reviews: {
    dismissal_restrictions: {
      users: ["SHNanayakkara", "samithau"],
      teams: [],
    },
    dismiss_stale_reviews: true,
    require_code_owner_reviews: false,
    required_approving_review_count: 1,
  },
  restrictions: {
    users: ["SHNanayakkara", "samithau"],
    teams: [],
    apps: [],
  },
  required_linear_history: false,
  allow_force_pushes: false,
  allow_deletions: false,
};

export const branches = ["master", "dev_protected", "sit_protected"];
