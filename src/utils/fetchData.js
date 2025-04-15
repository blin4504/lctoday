async function fetchRecentSubmissions(username) {
    const response = await fetch('/api/leetcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query userProfileRecentAcSubmissions($username: String!) {
            recentAcSubmissionList(username: $username) {
              id
              title
              titleSlug
              timestamp
            }
          }
        `,
        variables: {
          username: username,
        },
      }),
    });
  
    const data = await response.json();
  
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }
  
    return data.data?.recentAcSubmissionList || [];
  }
  
  function filterByDays(submissions, days) {
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
  
    return submissions.filter(
      (sub) => new Date(sub.timestamp * 1000).getTime() >= cutoff
    );
  }
  
  export { fetchRecentSubmissions, filterByDays };
  