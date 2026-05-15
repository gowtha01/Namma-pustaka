import { format } from "date-fns";

export function formatDisplayDate(value) {
  if (!value) {
    return "Pending";
  }

  const date = value instanceof Date ? value : value?.toDate?.() || null;
  return date ? format(date, "dd MMM yyyy") : "Pending";
}

export function averageRating(reviews) {
  if (!reviews?.length) {
    return 0;
  }

  return (
    reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
    reviews.length
  );
}
