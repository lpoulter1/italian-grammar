"use client";

import { useState, useEffect } from "react";
import { VerbType } from "@/types/verbs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { verbs } from "@/data/verbs";
import { SentenceTemplate, hardcodedSentenceTemplates } from "@/data/sentences";
import { isAlmostCorrect, highlightDifferences } from "@/utils/string";
import { CheckIcon, XIcon, AlertCircleIcon } from "lucide-react";

enum FeedbackType {
  NONE,
  CORRECT,
  ALMOST,
  INCORRECT,
  REVEALED,
}

enum Mode {
  TYPING,
  REVEAL,
}

export default function Home() {
  const [selectedType, setSelectedType] = useState<VerbType>("all");
  // Flashcard state
  const [sentences, setSentences] = useState<SentenceTemplate[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<FeedbackType>(FeedbackType.NONE);
  const [mode, setMode] = useState<Mode>(Mode.TYPING);
  const [showTranslation, setShowTranslation] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Initialize sentences
  useEffect(() => {
    // For now, use the hardcoded sentences
    // In a more advanced version, you could use: generateSentenceTemplates(verbs)
    const filteredSentences =
      selectedType === "all"
        ? hardcodedSentenceTemplates
        : hardcodedSentenceTemplates.filter((s) => {
            const verb = verbs.find((v) => v.infinitive === s.verb);
            return verb?.type === selectedType;
          });

    setSentences(filteredSentences);
    setCurrentSentenceIndex(0);
    resetCard();
  }, [selectedType]);

  const resetCard = () => {
    setUserAnswer("");
    setFeedback(FeedbackType.NONE);
    setMode(Mode.TYPING);
    setShowTranslation(false);
  };

  const getCurrentSentence = (): SentenceTemplate | undefined => {
    return sentences[currentSentenceIndex];
  };

  const handleCheck = () => {
    const currentSentence = getCurrentSentence();
    if (!currentSentence) return;

    const cleanUserAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = currentSentence.answer.toLowerCase();

    setTotalAttempts((prev) => prev + 1);

    if (cleanUserAnswer === correctAnswer) {
      setFeedback(FeedbackType.CORRECT);
      setTotalScore((prev) => prev + 1);
    } else if (isAlmostCorrect(cleanUserAnswer, correctAnswer)) {
      setFeedback(FeedbackType.ALMOST);
    } else {
      setFeedback(FeedbackType.INCORRECT);
    }
  };

  const handleReveal = () => {
    setMode(Mode.REVEAL);
    setFeedback(FeedbackType.REVEALED);
  };

  const handleSelfReport = (knewIt: boolean) => {
    if (knewIt) {
      setTotalScore((prev) => prev + 1);
    }
    setTotalAttempts((prev) => prev + 1);

    // Advance to next card after a short delay
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    } else {
      // Restart at the beginning when we've gone through all cards
      setCurrentSentenceIndex(0);
    }
    resetCard();
  };

  const renderFeedback = () => {
    const currentSentence = getCurrentSentence();
    if (!currentSentence) return null;

    switch (feedback) {
      case FeedbackType.CORRECT:
        return (
          <div className="flex items-center mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-md text-green-700 dark:text-green-300">
            <CheckIcon className="w-5 h-5 mr-2" />
            <p>Correct! Well done.</p>
          </div>
        );
      case FeedbackType.ALMOST:
        return (
          <div className="flex items-center mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-md text-yellow-700 dark:text-yellow-300">
            <AlertCircleIcon className="w-5 h-5 mr-2" />
            <div>
              <p>Almost correct!</p>
              <p>
                The correct answer is:{" "}
                <span className="font-bold">{currentSentence.answer}</span>
              </p>
              <p>
                You typed: <span className="font-bold">{userAnswer}</span>
              </p>
            </div>
          </div>
        );
      case FeedbackType.INCORRECT:
        return (
          <div className="flex items-center mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-md text-red-700 dark:text-red-300">
            <XIcon className="w-5 h-5 mr-2" />
            <div>
              <p>Incorrect!</p>
              <p>
                The correct answer is:{" "}
                <span className="font-bold">{currentSentence.answer}</span>
              </p>
              <p
                dangerouslySetInnerHTML={{
                  __html: `Difference: ${highlightDifferences(
                    userAnswer,
                    currentSentence.answer
                  )}`,
                }}
              />
            </div>
          </div>
        );
      case FeedbackType.REVEALED:
        return (
          <div className="flex flex-col items-center mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-700 dark:text-blue-300">
            <p>
              The correct answer is:{" "}
              <span className="font-bold">{currentSentence.answer}</span>
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => handleSelfReport(true)}
                className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/30"
              >
                Pass
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSelfReport(false)}
                className="border-red-500 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Fail
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const accuracy =
    totalAttempts > 0 ? Math.round((totalScore / totalAttempts) * 100) : 0;
  const currentSentence = getCurrentSentence();
  const verbCountByType = {
    all: verbs.length,
    are: verbs.filter((v) => v.type === "are").length,
    ere: verbs.filter((v) => v.type === "ere").length,
    ire: verbs.filter((v) => v.type === "ire").length,
    "ire-isc": verbs.filter((v) => v.type === "ire-isc").length,
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center flex-grow space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Italian Verb Flashcards
            </h1>
            <p className="text-muted-foreground">
              Master Italian verb conjugations through practice
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setSelectedType(value as VerbType)}
        >
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-100/80 dark:bg-slate-800/50">
            <TabsTrigger value="all">
              All{" "}
              <span className="text-muted-foreground ml-1">
                ({verbCountByType.all})
              </span>
            </TabsTrigger>
            <TabsTrigger value="are">
              -are{" "}
              <span className="text-muted-foreground ml-1">
                ({verbCountByType.are})
              </span>
            </TabsTrigger>
            <TabsTrigger value="ere">
              -ere{" "}
              <span className="text-muted-foreground ml-1">
                ({verbCountByType.ere})
              </span>
            </TabsTrigger>
            <TabsTrigger value="ire">
              -ire{" "}
              <span className="text-muted-foreground ml-1">
                ({verbCountByType.ire})
              </span>
            </TabsTrigger>
            <TabsTrigger value="ire-isc">
              -isc{" "}
              <span className="text-muted-foreground ml-1">
                ({verbCountByType["ire-isc"]})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType}>
            {currentSentence ? (
              <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center w-full">
                    <CardTitle className="text-2xl">
                      Fill in the blank
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Card {currentSentenceIndex + 1} of {sentences.length}
                    </div>
                  </div>
                  {/* Optional translation toggle */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTranslation(!showTranslation)}
                      className="text-xs dark:border-slate-700"
                    >
                      {showTranslation ? "Hide" : "Show"} Translation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-lg font-medium text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
                    {currentSentence.sentence}
                  </div>

                  {showTranslation && (
                    <div className="text-sm text-muted-foreground text-center italic">
                      {currentSentence.translation}
                    </div>
                  )}

                  {mode === Mode.TYPING && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">
                        Your answer:
                      </label>
                      <Input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type the conjugated verb..."
                        className="w-full bg-transparent dark:text-white"
                        disabled={feedback !== FeedbackType.NONE}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            feedback === FeedbackType.NONE
                          ) {
                            handleCheck();
                          }
                        }}
                      />
                    </div>
                  )}

                  {renderFeedback()}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                  {mode === Mode.TYPING && feedback === FeedbackType.NONE && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleReveal}
                        className="w-full sm:w-auto dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        Reveal
                      </Button>
                      <Button
                        onClick={handleCheck}
                        className="w-full sm:w-auto"
                      >
                        Check
                      </Button>
                    </>
                  )}

                  {feedback !== FeedbackType.NONE &&
                    feedback !== FeedbackType.REVEALED && (
                      <Button onClick={handleNext} className="w-full">
                        Next
                      </Button>
                    )}
                </CardFooter>
              </Card>
            ) : (
              <div className="text-center py-8">
                No cards available for this verb type.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Progress
              </h2>
              <p className="text-muted-foreground">
                Score: {totalScore} / {totalAttempts} ({accuracy}% accuracy)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
