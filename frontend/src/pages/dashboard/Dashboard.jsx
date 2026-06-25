import { motion } from "framer-motion";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  PlusCircle,
  Activity,
  AlertTriangle,
  AlertCircle,
  Coins,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "@/features/post/postSlice";
import { logoutUser } from "@/features/auth/authSlice";
import { updateAccountType } from "@/features/profile/profileSlice";
import { updateUser } from "@/features/auth/authSlice";
import UserDetails from "@/components/Dashboard/UserDetails";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import { getSavedPosts } from "@/features/savedPosts/savedPostSlice";
import EmailVerificationModal from "@/components/Auth/EmailVerificationModal";
import BuyCreditsModal from "@/components/ui/BuyCreditsModal";
import axiosInstance from "@/utils/axiosInterceptor";

const FREE_POST_LIMIT = 5;

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [showAccountTypePrompt, setShowAccountTypePrompt] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);

  const isOwner = user?.accountType === "ownerLookingForRenters";

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getSavedPosts());
  }, [dispatch]);

  useEffect(() => {
    if (isOwner) {
      setCreditsLoading(true);
      axiosInstance
        .get("/payments/credits-balance")
        .then((res) => setCreditsBalance(res.data.data?.balance ?? 0))
        .catch(() => {})
        .finally(() => setCreditsLoading(false));
    }
  }, [isOwner]);

  useEffect(() => {
    if (user?.provider === "google" && !user?.accountType) {
      setShowAccountTypePrompt(true);
    } else {
      setShowAccountTypePrompt(false);
    }
  }, [user]);

  const handleNavigate = (path) => navigate(path);

  const totalPosts = posts.filter((p) => p.user?._id === user?._id).length;
  const { saved } = useSelector((s) => s.savedPosts);
  const totalSavedPosts = saved.length;

  const recentActivities = posts
    .filter((p) => p.user?._id === user?._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handleAccountTypeSubmit = async () => {
    if (!selectedAccountType) {
      toast.error("Please select an account type");
      return;
    }
    try {
      const updatedUser = await dispatch(
        updateAccountType(selectedAccountType)
      ).unwrap();
      dispatch(updateUser(updatedUser));
      toast.success("Account type saved!");
      setShowAccountTypePrompt(false);
    } catch {
      toast.error("Failed to save account type");
    }
  };

  const accountTypeOptions = [
    { label: "Looking for Room",          value: "lookingForRoom" },
    { label: "Looking for Roommate",       value: "lookingForRoommate" },
    { label: "Owner Looking for Renters",  value: "ownerLookingForRenters" },
  ];

  const quickActions = [
    {
      title: "Create New Post",
      icon: PlusCircle,
      color: "text-primary",
      onClick: () => handleNavigate("/create-post"),
    },
    {
      title: "View My Posts",
      icon: FileText,
      color: "text-accent",
      onClick: () => handleNavigate("/my-posts"),
    },
    {
      title: "Saved Posts",
      icon: Bookmark,
      color: "text-primary",
      onClick: () => handleNavigate("/saved"),
    },
    {
      title: "Edit Profile",
      icon: Settings,
      color: "text-muted-foreground",
      onClick: () => handleNavigate("/edit-profile"),
    },
  ];

  // Post credits logic for owners
  const freePostsUsed    = Math.min(totalPosts, FREE_POST_LIMIT);
  const freePostsLeft    = Math.max(0, FREE_POST_LIMIT - totalPosts);
  const onPaidPosts      = totalPosts >= FREE_POST_LIMIT;
  const freePct          = (freePostsUsed / FREE_POST_LIMIT) * 100;

  return (
    <motion.div
      className="min-h-screen bg-background py-12 px-4 md:px-8"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <BuyCreditsModal
        open={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
        onSuccess={(result) => {
          setCreditsBalance((prev) => prev + (result?.creditsAdded ?? 0));
          toast.success(`${result?.creditsAdded} post credit(s) added!`);
        }}
      />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        {user && !user.isVerified && (
          <div className="bg-warning border border-warning-foreground p-4 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-warning-foreground" />
              <p>Email not verified. Verify now!</p>
            </div>
            <Button onClick={() => setVerifyOpen(true)} className="bg-primary text-white">
              Verify Email
            </Button>
          </div>
        )}

        <EmailVerificationModal open={verifyOpen} setOpen={setVerifyOpen} />

        {/* Account type prompt */}
        {showAccountTypePrompt && (
          <div className="mb-6 px-3">
            <div className="p-5 bg-amber-100 border border-amber-300 text-amber-800 rounded-xl">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <p className="text-sm font-semibold">Choose your role to continue</p>
              </div>
              <p className="text-xs sm:text-sm mt-1 text-amber-900/90 text-center">
                Select what best describes you to complete your setup.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {accountTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedAccountType(opt.value)}
                    className={`w-full h-10 rounded-xl border text-sm flex items-center justify-center transition-all duration-200 ${
                      selectedAccountType === opt.value
                        ? "border-amber-600 bg-amber-300/40 font-medium shadow-md scale-[1.02]"
                        : "border-amber-300 bg-white hover:bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedAccountType === opt.value && (
                        <span className="w-3 h-3 rounded-full bg-amber-700" />
                      )}
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
              {selectedAccountType && (
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={handleAccountTypeSubmit}
                    className="px-6 py-2 rounded-lg bg-amber-800 text-white hover:bg-amber-900 transition-all text-sm shadow"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Header — left aligned */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3 flex-wrap">
          Welcome, <span className="text-primary">{user?.userName}</span>
          {user?.kycStatus === "verified" && <VerifiedBadge size={28} />}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Manage your posts, track engagement, and personalize your experience.
        </p>

        {/* KYC Banner — centered, gradient */}
        {user?.kycStatus !== "verified" && (
          <div className="mt-5 flex justify-center">
            <div className="relative overflow-hidden w-full max-w-2xl rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20">
              <div className="rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/80 dark:via-violet-950/80 dark:to-purple-950/80 px-5 py-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <VerifiedBadge size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200">
                    Stand out — verify your identity
                  </p>
                  <p className="text-xs text-indigo-600/80 dark:text-indigo-400 mt-0.5">
                    Verified users build more trust and get more responses. One-time ₹99.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/verify-identity")}
                  className="shrink-0 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl shadow-md transition-all"
                >
                  Verify Now →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Role Highlight */}
      <ProfileCard user={user} />

      {/* User Details Card */}
      <div className="max-w-6xl mx-auto mb-10">
        <UserDetails user={user} className="w-full" />
      </div>

      {/* ── Post Credits Card (owners only) ─────────────────────── */}
      {isOwner && (
        <div className="max-w-6xl mx-auto mb-10">
          <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            Post Credits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free posts tracker */}
            <Card className="p-6 border border-border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Free Posts</p>
                  <h3 className="text-2xl font-bold text-foreground mt-0.5">
                    {freePostsUsed} / {FREE_POST_LIMIT}
                  </h3>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  freePostsLeft > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300"
                }`}>
                  {freePostsLeft > 0 ? `${freePostsLeft} left` : "Limit reached"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    freePct >= 100
                      ? "bg-red-500"
                      : freePct >= 80
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${freePct}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                {freePostsLeft > 0
                  ? `You have ${freePostsLeft} free post${freePostsLeft !== 1 ? "s" : ""} remaining.`
                  : "You've used all 5 free posts. Purchase credits to keep posting."}
              </p>
            </Card>

            {/* Paid credits */}
            <Card className={`p-6 border bg-card ${
              onPaidPosts && creditsBalance === 0
                ? "border-amber-400 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/20"
                : "border-border"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Post Credits</p>
                  <h3 className="text-2xl font-bold text-foreground mt-0.5">
                    {creditsLoading ? "—" : creditsBalance}
                    <span className="text-sm font-normal text-muted-foreground ml-1">credits</span>
                  </h3>
                </div>
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                {creditsBalance > 0
                  ? `Each credit lets you publish 1 post. ₹49 per credit.`
                  : onPaidPosts
                  ? "You need credits to publish your next post. ₹49 per post."
                  : "Credits are used after your 5 free posts are exhausted. ₹49 per post."}
              </p>

              <button
                onClick={() => setShowBuyCredits(true)}
                className={`w-full text-sm font-semibold py-2 rounded-xl transition-all ${
                  onPaidPosts && creditsBalance === 0
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20"
                    : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                }`}
              >
                {onPaidPosts && creditsBalance === 0
                  ? "Buy Credits to Keep Posting →"
                  : "Buy More Credits"}
              </button>
            </Card>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto mb-10">
        <div className="p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">My Posts</p>
              <h2 className="text-2xl font-semibold text-foreground">{totalPosts}</h2>
            </div>
            <FileText className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saved Posts</p>
              <h2 className="text-2xl font-semibold text-foreground">{totalSavedPosts}</h2>
            </div>
            <Bookmark className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <div key={idx} className="cursor-pointer" onClick={action.onClick}>
              <Card className="flex flex-col items-center justify-center py-6 border border-border hover:border-primary hover:shadow-lg bg-card transition-all text-center group rounded-xl">
                <action.icon className={`w-8 h-8 mb-3 ${action.color} group-hover:scale-110 transition-transform duration-200`} />
                <p className="font-medium text-foreground group-hover:text-primary">
                  {action.title}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </h2>
        <Card className="p-6 border border-border bg-card">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors rounded-md p-2"
                  onClick={() => handleNavigate(`/post/${activity._id}`)}
                >
                  <div>
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Rating: {activity.averageRating || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activities yet.</p>
          )}
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border border-border bg-card">
            <div className="flex items-center gap-4">
              <BarChart2 className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <h3 className="text-2xl font-semibold text-foreground">
                  {posts.filter((p) => p.user?._id === user?._id).length > 0
                    ? (
                        posts
                          .filter((p) => p.user?._id === user?._id)
                          .reduce((acc, p) => acc + (p.averageRating || 0), 0) /
                        posts.filter((p) => p.user?._id === user?._id).length
                      ).toFixed(1)
                    : 0}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-center gap-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Most Rated Post</p>
                <h3 className="text-lg font-semibold text-foreground">
                  {posts
                    .filter((p) => p.user?._id === user?._id)
                    .sort((a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0))[0]
                    ?.title || "None"}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Age</p>
                <h3 className="text-2xl font-semibold text-foreground">
                  {user?.createdAt
                    ? Math.ceil(
                        (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
                      ) + " days"
                    : "—"}
                </h3>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="max-w-6xl mx-auto mt-10 flex flex-wrap justify-between gap-4">
        <Button
          onClick={() => handleNavigate("/edit-profile")}
          variant="outline"
          className="flex items-center gap-2 border-border hover:border-primary hover:text-primary"
        >
          <Settings className="w-4 h-4" />
          Profile Settings
        </Button>

        <Button
          onClick={() => dispatch(logoutUser())}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
}
