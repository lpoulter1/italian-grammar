"use client";

import { useState, useEffect, useRef } from "react";
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
import { verbs } from "@/data/verbs";
import { SentenceTemplate, hardcodedSentenceTemplates } from "@/data/sentences";
import { isAlmostCorrect, highlightDifferences } from "@/utils/string";
import { CheckIcon, XIcon, AlertCircleIcon, SettingsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userSettings } from "@/services/userSettings";

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
  // Replace selectedType with selectedVerbs
  const [selectedVerbs, setSelectedVerbs] = useState<string[]>([]);
  // Flashcard state
  const [sentences, setSentences] = useState<SentenceTemplate[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<FeedbackType>(FeedbackType.NONE);
  const [mode, setMode] = useState<Mode>(Mode.TYPING);
  const [showTranslation, setShowTranslation] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showConjugations, setShowConjugations] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<string>>(
    new Set()
  );
  const [allSentences, setAllSentences] = useState<SentenceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveIndicator, setSaveIndicator] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add a state to prevent immediate submission after card transition
  const [preventSubmission, setPreventSubmission] = useState(false);

  // Load settings on mount
  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    // Load selected verbs
    const savedVerbs = userSettings.getSelectedVerbs();
    if (savedVerbs.length > 0) {
      setSelectedVerbs(savedVerbs);
    } else {
      // Default to all verbs if none are saved
      setSelectedVerbs(verbs.map((v) => v.infinitive));
    }

    // Load progress data
    const progress = userSettings.getProgress();
    setTotalScore(progress.totalScore);
    setTotalAttempts(progress.totalAttempts);

    if (Array.isArray(progress.answeredCorrectly)) {
      setAnsweredCorrectly(new Set(progress.answeredCorrectly));
    }

    // Load UI preferences
    const uiPrefs = userSettings.getUiPreferences();
    setShowTranslation(uiPrefs.showTranslation);
    setShowConjugations(uiPrefs.showConjugations);

    // Finish loading
    setIsLoading(false);
  }, []);

  // Save selected verbs when they change
  useEffect(() => {
    if (selectedVerbs.length > 0) {
      userSettings.saveSelectedVerbs(selectedVerbs);

      // Show save indicator
      setSaveIndicator("Settings saved");
      const timer = setTimeout(() => setSaveIndicator(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedVerbs]);

  // Save progress when it changes
  useEffect(() => {
    // Skip initial render
    if (isLoading) return;

    userSettings.saveProgress({
      totalScore,
      totalAttempts,
      answeredCorrectly: Array.from(answeredCorrectly),
    });

    // Show save indicator when progress changes
    if (totalScore > 0 || totalAttempts > 0) {
      setSaveIndicator("Progress saved");
      const timer = setTimeout(() => setSaveIndicator(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [totalScore, totalAttempts, answeredCorrectly, isLoading]);

  // Save UI preferences when they change
  useEffect(() => {
    // Skip initial render
    if (isLoading) return;

    userSettings.saveUiPreferences({
      showTranslation,
      showConjugations,
    });

    // Show save indicator
    setSaveIndicator("Preferences saved");
    const timer = setTimeout(() => setSaveIndicator(null), 2000);
    return () => clearTimeout(timer);
  }, [showTranslation, showConjugations, isLoading]);

  // Ensure we prevent form submission right after navigating to a new card
  useEffect(() => {
    if (preventSubmission) {
      // Reset after a short delay to allow the new card to load
      const timer = setTimeout(() => {
        setPreventSubmission(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [preventSubmission]);

  // Auto-focus the input field whenever a new card is shown or after reset
  useEffect(() => {
    if (
      mode === Mode.TYPING &&
      feedback === FeedbackType.NONE &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [currentSentenceIndex, mode, feedback]);

  // Global keyboard handler for Enter key to advance cards when feedback is shown
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only handle Enter key when feedback is shown but not in reveal mode
      if (
        e.key === "Enter" &&
        feedback !== FeedbackType.NONE &&
        feedback !== FeedbackType.REVEALED &&
        !preventSubmission
      ) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [feedback, preventSubmission]);

  // Function to get the current sentence
  const getCurrentSentence = (): SentenceTemplate | undefined => {
    return sentences[currentSentenceIndex];
  };

  // Get current sentence
  const currentSentence = getCurrentSentence();

  // Initialize sentences
  useEffect(() => {
    // Generate complete conjugation templates for all selected verbs
    const allTemplates = [];

    // Track which verb+person combinations we've already added
    const addedCombinations = new Set<string>();

    // Add hardcoded sentences first (if they match selected verbs)
    hardcodedSentenceTemplates.forEach((template) => {
      if (selectedVerbs.includes(template.verb)) {
        allTemplates.push(template);
        // Track this verb+person combination
        addedCombinations.add(`${template.verb}-${template.person}`);
      }
    });

    // Generate templates for each selected verb (only for missing persons)
    for (const verbInfinitive of selectedVerbs) {
      const verbTemplates = generateVerbSpecificTemplates(
        verbInfinitive,
        addedCombinations
      );
      allTemplates.push(...verbTemplates);
    }

    // Store all sentences and filter out answered ones
    setAllSentences(allTemplates);
    filterAnsweredCards(allTemplates);

    // Reset the current sentence index
    setCurrentSentenceIndex(0);
    resetCard();
  }, [selectedVerbs]);

  // Filter out cards that have been answered correctly
  const filterAnsweredCards = (
    templates: SentenceTemplate[] = allSentences
  ) => {
    const filteredCards = templates.filter(
      (template) =>
        !answeredCorrectly.has(`${template.verb}-${template.person}`)
    );
    setSentences(filteredCards);

    // Make sure the current index doesn't exceed the number of available cards
    if (
      currentSentenceIndex >= filteredCards.length &&
      filteredCards.length > 0
    ) {
      setCurrentSentenceIndex(0);
    }
  };

  // Modify resetProgress to use the UserSettings service
  const resetProgress = () => {
    setAnsweredCorrectly(new Set());
    setTotalScore(0);
    setTotalAttempts(0);

    // Clear progress in storage
    userSettings.resetProgress();

    filterAnsweredCards();
    setCurrentSentenceIndex(0);
    resetCard();
  };

  // Generate templates for all conjugations of a specific verb
  const generateVerbSpecificTemplates = (
    verbInfinitive: string,
    existingCombinations: Set<string>
  ): SentenceTemplate[] => {
    const templates: SentenceTemplate[] = [];
    const verb = verbs.find((v) => v.infinitive === verbInfinitive);
    if (!verb) return templates;

    // Common objects that can be used in sentences
    const objectMap: Record<string, string[]> = {
      mangiare: ["la pizza", "la pasta", "il gelato", "la frutta"],
      parlare: ["italiano", "con gli amici", "al telefono", "di politica"],
      studiare: ["matematica", "storia", "italiano", "scienze"],
      lavorare: ["in ufficio", "da casa", "molto", "poco"],
      leggere: ["un libro", "il giornale", "una rivista", "delle email"],
      scrivere: ["una lettera", "un messaggio", "un'email", "un articolo"],
      vedere: ["un film", "la TV", "gli amici", "il paesaggio"],
      bere: ["acqua", "vino", "caffè", "una bibita"],
      sentire: ["la musica", "un rumore", "una voce", "il canto degli uccelli"],
      dormire: ["bene", "male", "poco", "troppo"],
      capire: ["la lezione", "il concetto", "il problema", "la domanda"],
      finire: ["il lavoro", "i compiti", "il libro", "la cena"],
      preferire: ["il caffè", "la pizza", "restare a casa", "viaggiare"],
    };

    // Create sentences for each conjugation not already covered
    Object.entries(verb.conjugations).forEach(([person, conjugation]) => {
      const combinationKey = `${verbInfinitive}-${person}`;

      // Skip if we already have this combination
      if (!existingCombinations.has(combinationKey)) {
        // Get objects relevant to this verb or use defaults
        const objects = objectMap[verbInfinitive] || [
          "sempre",
          "spesso",
          "molto",
          "",
        ];
        const object = objects[Math.floor(Math.random() * objects.length)];

        // Create the sentence
        const sentence = `${person} ______ ${object}`;

        // Create the translation
        const translationPerson =
          person === "io"
            ? "I"
            : person === "tu"
            ? "you"
            : person === "lui"
            ? "he/she"
            : person === "noi"
            ? "we"
            : person === "voi"
            ? "you all"
            : "they";

        const translation = `${translationPerson} ${verb.meaning.replace(
          "to ",
          ""
        )} ${object}`;

        // Add the template
        templates.push({
          sentence,
          verb: verbInfinitive,
          person,
          answer: conjugation,
          translation,
        });

        // Mark this combination as added
        existingCombinations.add(combinationKey);
      }
    });

    return templates;
  };

  const resetCard = () => {
    setUserAnswer("");
    setFeedback(FeedbackType.NONE);
    setMode(Mode.TYPING);
    setShowTranslation(false);
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

      // Add this card to the correctly answered set
      const key = `${currentSentence.verb}-${currentSentence.person}`;
      setAnsweredCorrectly((prev) => {
        const newSet = new Set(prev);
        newSet.add(key);
        return newSet;
      });

      // Filter the deck immediately after marking a card as correct
      filterAnsweredCards();
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
    // Set the flag to prevent immediate submission on the next card
    setPreventSubmission(true);

    // Check if we're at the end of the current deck
    if (currentSentenceIndex >= sentences.length - 1) {
      // If there are still cards left after filtering, start from the beginning
      if (sentences.length > 0) {
        setCurrentSentenceIndex(0);
      }
      // If no cards left, the completion screen will show automatically
    } else if (sentences.length > 0) {
      // Not at the end yet, just go to the next card
      // But make sure we don't exceed the array bounds
      setCurrentSentenceIndex((prev) =>
        Math.min(prev + 1, sentences.length - 1)
      );
    }
    resetCard();
  };

  const handleToggleVerb = (verbInfinitive: string) => {
    setSelectedVerbs((prev) => {
      if (prev.includes(verbInfinitive)) {
        return prev.filter((v) => v !== verbInfinitive);
      } else {
        return [...prev, verbInfinitive];
      }
    });
  };

  const handleSelectAllVerbs = () => {
    setSelectedVerbs(verbs.map((v) => v.infinitive));
  };

  const handleDeselectAllVerbs = () => {
    setSelectedVerbs([]);
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

  // Group verbs by type for the settings dialog
  const verbsByType = {
    are: verbs.filter((v) => v.type === "are"),
    ere: verbs.filter((v) => v.type === "ere"),
    ire: verbs.filter((v) => v.type === "ire"),
    "ire-isc": verbs.filter((v) => v.type === "ire-isc"),
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-fade-out {
          animation: fadeOut 2s ease-in-out forwards;
        }
      `}</style>

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
          <div className="flex gap-2 items-center">
            {saveIndicator && (
              <span className="text-xs text-green-600 dark:text-green-400 animate-fade-out">
                {saveIndicator}
              </span>
            )}
            {/* Settings Dialog */}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Verbs</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllVerbs}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAllVerbs}
                    >
                      Deselect All
                    </Button>
                  </div>

                  {/* Add quick filter buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedVerbs(
                          verbs
                            .filter((v) => !v.isIrregular)
                            .map((v) => v.infinitive)
                        )
                      }
                      className="text-xs"
                    >
                      Only Regular Verbs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedVerbs(
                          verbs
                            .filter((v) => v.isIrregular)
                            .map((v) => v.infinitive)
                        )
                      }
                      className="text-xs"
                    >
                      Only Irregular Verbs
                    </Button>
                  </div>

                  <ScrollArea className="h-72 pr-4">
                    {Object.entries(verbsByType).map(([type, typeVerbs]) => (
                      <div key={type} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                          -{type} verbs
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {typeVerbs.map((verb) => (
                            <div
                              key={verb.infinitive}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={verb.infinitive}
                                checked={selectedVerbs.includes(
                                  verb.infinitive
                                )}
                                onCheckedChange={() =>
                                  handleToggleVerb(verb.infinitive)
                                }
                              />
                              <Label
                                htmlFor={verb.infinitive}
                                className="text-sm cursor-pointer"
                              >
                                {verb.infinitive}
                                {verb.isIrregular && (
                                  <span className="ml-1 px-1 py-0.5 text-xs bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 rounded-sm">
                                    irregular
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({verb.meaning})
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                <DialogFooter>
                  <div className="w-full text-center text-sm text-muted-foreground">
                    Selected {selectedVerbs.length} of {verbs.length} verbs
                    <span className="block text-xs">
                      Including{" "}
                      {
                        verbs.filter(
                          (v) =>
                            v.isIrregular &&
                            selectedVerbs.includes(v.infinitive)
                        ).length
                      }{" "}
                      irregular verbs
                    </span>
                  </div>
                  <DialogClose asChild>
                    <Button type="button">Done</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>

        {isLoading ? (
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg p-8">
            <div className="text-center py-8">
              <p className="text-lg font-medium">Loading your saved data...</p>
            </div>
          </Card>
        ) : sentences.length > 0 ? (
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center w-full">
                <CardTitle className="text-2xl">Fill in the blank</CardTitle>
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
            {currentSentence && (
              <CardContent className="space-y-4">
                <div className="text-lg font-medium text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
                  {currentSentence.sentence}
                </div>

                {/* Add the infinitive form of the verb */}
                <div className="flex items-center justify-center gap-2 text-center flex-wrap">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    Verb:
                  </span>
                  <span className="font-bold">{currentSentence.verb}</span>
                  {/* Show irregular tag if the verb is irregular */}
                  {verbs.find((v) => v.infinitive === currentSentence.verb)
                    ?.isIrregular && (
                    <span className="px-1.5 py-0.5 text-xs bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 rounded-sm">
                      irregular
                    </span>
                  )}
                  {/* Find the verb in the verbs array to show its meaning */}
                  {verbs.find((v) => v.infinitive === currentSentence.verb) && (
                    <span className="text-sm text-muted-foreground">
                      (
                      {
                        verbs.find((v) => v.infinitive === currentSentence.verb)
                          ?.meaning
                      }
                      )
                    </span>
                  )}
                  {/* Remove the practice all forms button, keep only the show conjugations button */}
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConjugations(!showConjugations)}
                      className="text-xs dark:border-slate-700"
                    >
                      {showConjugations ? "Hide" : "Show"} All Conjugations
                    </Button>
                  </div>
                </div>

                {/* Display conjugation table */}
                {showConjugations && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
                    <h3 className="text-md font-medium mb-2 text-center">
                      All Conjugations for &ldquo;{currentSentence.verb}&rdquo;
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(
                        verbs.find((v) => v.infinitive === currentSentence.verb)
                          ?.conjugations || {}
                      ).map(([person, conjugation]) => (
                        <div
                          key={person}
                          className={`p-2 rounded-md ${
                            person === currentSentence.person
                              ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                              : "bg-transparent"
                          }`}
                        >
                          <div className="font-medium">{person}</div>
                          <div className="text-lg">{conjugation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();

                        // If we just navigated to a new card, don't submit
                        if (preventSubmission) return;

                        if (feedback === FeedbackType.NONE) {
                          handleCheck();
                        } else if (feedback !== FeedbackType.REVEALED) {
                          handleNext();
                        }
                      }}
                    >
                      <Input
                        ref={inputRef}
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type the conjugated verb..."
                        className="w-full bg-transparent dark:text-white"
                        disabled={feedback !== FeedbackType.NONE}
                      />
                    </form>
                  </div>
                )}

                {renderFeedback()}
              </CardContent>
            )}
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
                  <Button onClick={handleCheck} className="w-full sm:w-auto">
                    Check
                  </Button>
                </>
              )}

              {feedback !== FeedbackType.NONE &&
                feedback !== FeedbackType.REVEALED && (
                  <Button
                    onClick={handleNext}
                    className="w-full"
                    aria-keyshortcuts="Enter"
                  >
                    Next
                  </Button>
                )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg p-8">
            <div className="text-center py-8 space-y-6">
              {allSentences.length > 0 ? (
                // All cards have been answered correctly - show completion screen
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Great job! You&apos;ve completed all the cards.
                  </h3>
                  <p className="text-muted-foreground">
                    You&apos;ve correctly answered all {allSentences.length}{" "}
                    conjugations!
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button onClick={resetProgress} className="mt-4">
                      Practice Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSettingsOpen(true)}
                    >
                      Select Different Verbs
                    </Button>
                  </div>
                </>
              ) : (
                // No verbs selected
                <>
                  <p className="text-lg font-medium">
                    No cards available for the selected verbs.
                  </p>
                  <Button onClick={() => setSettingsOpen(true)}>
                    Select Verbs
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Progress
              </h2>
              <p className="text-muted-foreground">
                Score: {totalScore} / {totalAttempts} ({accuracy}% accuracy)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cards remaining: {sentences.length} / {allSentences.length}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetProgress}
              className="text-xs"
            >
              Reset Progress
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
