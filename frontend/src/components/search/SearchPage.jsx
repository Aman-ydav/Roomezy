import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts, setSearchParams } from "@/features/post/postSlice";
import PostCard from "@/components/post/PostCard";
import PostSkeleton from "@/components/home/PostSkeleton";
import SearchBar from "./SearchBar";
import FilterSheet from "./FilterSheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchPage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { posts, loading, pagination } = useSelector((s) => s.post);

  const urlParams = new URLSearchParams(location.search);
  const initialQ    = urlParams.get("q")    || "";
  const initialPage = Number(urlParams.get("page") || 1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage,   setCurrentPage]   = useState(initialPage);

  const fetchPosts = useCallback(
    (q, filters, page) => {
      const params = { ...filters, page, limit: 20 };
      if (q) params.q = q;
      dispatch(getAllPosts(params));
      dispatch(setSearchParams(params));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchPosts(initialQ, activeFilters, currentPage);
  }, []);

  function handleSearch(q) {
    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);
    newParams.set("page", "1");
    navigate({ search: newParams.toString() });
    setCurrentPage(1);
    fetchPosts(q, activeFilters, 1);
  }

  function handleApplyFilters(filters) {
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchPosts(new URLSearchParams(location.search).get("q") || "", filters, 1);
  }

  function handlePage(page) {
    setCurrentPage(page);
    const q = new URLSearchParams(location.search).get("q") || "";
    fetchPosts(q, activeFilters, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const query = new URLSearchParams(location.search).get("q") || "";

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6 space-y-3">
        <SearchBar
          onSearch={handleSearch}
          onOpenFilters={() => setFiltersOpen(true)}
          initialQuery={query}
        />

        {query && (
          <p className="text-sm text-muted-foreground">
            Results for <span className="font-medium text-foreground">"{query}"</span>
            {pagination.total > 0 && ` — ${pagination.total} found`}
          </p>
        )}
      </div>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= pagination.pages}
                onClick={() => handlePage(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground mt-10 text-center">
          No results found{query ? ` for "${query}"` : ""}. Try different keywords or filters.
        </p>
      )}
    </motion.div>
  );
}
