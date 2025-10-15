
import React, { useState, useEffect, useRef } from "react";
import { palassapi } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, Wand2, Loader2 } from "lucide-react";
import { format, isValid } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Memory() {
  const [deleteId, setDeleteId] = useState(null);
  const [obliteratingId, setObliteratingId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: facts, isLoading } = useQuery({
    queryKey: ['facts', limit],
    queryFn: async () => {
      const allFacts = await palassapi.entities.Fact.list('-created_date', limit);
      // Check if we got fewer facts than requested (means no more to load)
      if (allFacts.length < limit) {
        setHasMore(false);
      }
      return allFacts;
    },
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => palassapi.entities.Fact.delete(id),
    onSuccess: () => {
      // Invalidate all fact queries including the one without limit
      queryClient.invalidateQueries({ queryKey: ['facts'] });
      setDeleteId(null);
      setObliteratingId(null);
    },
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          setLimit(prev => prev + 10);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading]);

  const handleObliviate = async () => {
    if (deleteId) {
      setObliteratingId(deleteId);
      await new Promise(resolve => setTimeout(resolve, 800));
      await deleteMutation.mutateAsync(deleteId);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Memory Bank
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Palass remembers everything you taught
          </p>
        </motion.div>

        {isLoading && facts.length === 0 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : facts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-purple-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              No memories yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start teaching Palass some facts!
            </p>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {facts.map((fact, index) => {
                  const isObliviating = obliteratingId === fact.id;
                  // Safely parse and format created_date. Some facts may have null/invalid dates.
                  const createdDate = fact.created_date ? new Date(fact.created_date) : null;
                  const formattedDate = createdDate && isValid(createdDate)
                    ? format(createdDate, "MMM d, yyyy 'at' h:mm a")
                    : 'Unknown date';
                  
                  return (
                    <motion.div
                      key={fact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.8,
                        filter: "blur(10px)",
                        transition: { duration: 0.5 }
                      }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card className={`p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-all relative overflow-hidden ${
                        isObliviating ? 'animate-pulse' : ''
                      }`}>
                        {isObliviating && (
                          <>
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                                initial={{ 
                                  x: '50%', 
                                  y: '50%',
                                  scale: 0,
                                  opacity: 1
                                }}
                                animate={{
                                  x: `${Math.random() * 100}%`,
                                  y: `${Math.random() * 100}%`,
                                  scale: [0, 1, 0],
                                  opacity: [1, 1, 0],
                                }}
                                transition={{
                                  duration: 0.8,
                                  delay: i * 0.05,
                                  ease: "easeOut"
                                }}
                              />
                            ))}
                          </>
                        )}
                        
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-3">
                              {fact.content}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formattedDate}
                              </span>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            whileTap={{ rotate: -15, scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(fact.id)}
                              className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors group"
                              disabled={isObliviating}
                            >
                              <Wand2 className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                            </Button>
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Loading indicator */}
            <div ref={loaderRef} className="py-8 flex justify-center">
              {hasMore ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-purple-500"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Loading more memories...</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 dark:text-gray-400"
                >
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm font-medium">You've reached the beginning of time ✨</p>
                </motion.div>
              )}
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>💾 Showing {facts.length} memor{facts.length !== 1 ? 'ies' : 'y'}</p>
        </motion.div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700 border-purple-200 dark:border-purple-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 dark:text-white text-purple-700 dark:text-purple-300">
              <Wand2 className="w-5 h-5 text-purple-500" />
              Obliviate Memory?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              ✨ This spell will permanently erase this memory from Palass's mind. The magic cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleObliviate}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Obliviate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
