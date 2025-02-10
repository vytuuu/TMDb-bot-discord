export function getMovieStars(voteAverage: number) {
  const MovieVoteAverage = Math.round(voteAverage / 2);
  const fullStars = [];
  const emptyStars = [];

  for (let i = 0; i < 5; i++) {
    if (i < MovieVoteAverage) {
      fullStars.push(i);
    } else {
      emptyStars.push(i);
    }
  }
  return { fullStars, emptyStars };
}