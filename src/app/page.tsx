"use client";

import { useState, useEffect } from "react";
import { Verb, PersonType, VerbType } from "@/types/verbs";
import { getHintVerb } from "@/utils/conjugation";
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

export default function Home() {
  const [currentVerb, setCurrentVerb] = useState<Verb | null>(null);
  const [hintVerb, setHintVerb] = useState<Verb | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedType, setSelectedType] = useState<VerbType>("all");
  const [usedVerbs, setUsedVerbs] = useState<Set<string>>(new Set());
  const [cycleCount, setCycleCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<PersonType, string>>({
    io: "",
    tu: "",
    lui: "",
    noi: "",
    voi: "",
    loro: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    setUsedVerbs(new Set());
    setCycleCount(0);
    loadNewVerb();
  }, [selectedType]);

  const getAvailableVerbs = (type: VerbType): Verb[] => {
    const verbsOfType =
      type === "all" ? verbs : verbs.filter((v) => v.type === type);
    return verbsOfType.filter((v) => !usedVerbs.has(v.infinitive));
  };

  const getRandomVerbOfType = (type: VerbType): Verb => {
    let availableVerbs = getAvailableVerbs(type);

    if (availableVerbs.length === 0) {
      setUsedVerbs(new Set());
      setCycleCount((prev) => prev + 1);
      availableVerbs =
        type === "all" ? verbs : verbs.filter((v) => v.type === type);
    }

    const randomVerb =
      availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    setUsedVerbs((prev) => new Set([...prev, randomVerb.infinitive]));
    return randomVerb;
  };

  const loadNewVerb = () => {
    const newVerb = getRandomVerbOfType(selectedType);
    setCurrentVerb(newVerb);
    setHintVerb(getHintVerb(newVerb));
    setUserAnswers({
      io: "",
      tu: "",
      lui: "",
      noi: "",
      voi: "",
      loro: "",
    });
    setShowResults(false);
    setShowHint(false);
  };

  const handleInputChange = (person: PersonType, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [person]: value.toLowerCase(),
    }));
  };

  const checkAnswers = () => {
    if (!currentVerb) return;

    let correct = 0;
    Object.entries(currentVerb.conjugations).forEach(
      ([person, conjugation]) => {
        if (userAnswers[person as PersonType].trim() === conjugation) {
          correct++;
        }
      }
    );

    setScore((prev) => prev + correct);
    setTotalAttempts((prev) => prev + 6);
    setShowResults(true);
  };

  const toggleHint = () => {
    setShowHint((prev) => !prev);
  };

  if (!currentVerb) return <div>Loading...</div>;

  const accuracy =
    totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
  const verbCountByType = {
    all: verbs.length,
    are: verbs.filter((v) => v.type === "are").length,
    ere: verbs.filter((v) => v.type === "ere").length,
    ire: verbs.filter((v) => v.type === "ire").length,
    "ire-isc": verbs.filter((v) => v.type === "ire-isc").length,
  };

  const availableVerbsCount = getAvailableVerbs(selectedType).length;
  const totalVerbsInType =
    selectedType === "all"
      ? verbs.length
      : verbs.filter((v) => v.type === selectedType).length;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center flex-grow space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Italian Verb Practice
            </h1>
            <p className="text-muted-foreground">
              Master Italian verb conjugations through practice
            </p>
            <div className="text-sm space-y-1">
              <p className="text-blue-600 dark:text-blue-400">
                {availableVerbsCount} verbs remaining in current set
              </p>
              {cycleCount > 0 && (
                <p className="text-green-600 dark:text-green-400">
                  Completed {cycleCount} full{" "}
                  {cycleCount === 1 ? "cycle" : "cycles"} of {totalVerbsInType}{" "}
                  verbs
                </p>
              )}
            </div>
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
            <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {currentVerb.infinitive}
                </CardTitle>
                <div className="text-sm text-muted-foreground text-center space-y-2">
                  <div>
                    {currentVerb.meaning} - {currentVerb.type} conjugation
                  </div>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/50 p-2 rounded-md">
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      Quick Tip:
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">
                      {currentVerb.type === "are" &&
                        "First conjugation (-are) verbs are the most common and regular."}
                      {currentVerb.type === "ere" &&
                        "Second conjugation (-ere) verbs often have unique patterns."}
                      {currentVerb.type === "ire" &&
                        "Third conjugation (-ire) verbs can follow two patterns."}
                      {currentVerb.type === "ire-isc" &&
                        "Some -ire verbs add -isc- in certain forms (io, tu, lui/lei, loro)."}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.entries(userAnswers) as [PersonType, string][]).map(
                    ([person, value]) => (
                      <div key={person} className="space-y-1.5">
                        <label className="text-sm font-medium block">
                          <span className="flex items-center gap-2">
                            {person}
                            <span className="text-xs text-muted-foreground">
                              {person === "io" && "(I)"}
                              {person === "tu" && "(you)"}
                              {person === "lui" && "(he/she/it)"}
                              {person === "noi" && "(we)"}
                              {person === "voi" && "(you all)"}
                              {person === "loro" && "(they)"}
                            </span>
                          </span>
                        </label>
                        <Input
                          type="text"
                          value={value}
                          placeholder={
                            person === "io"
                              ? `I ${currentVerb.meaning.replace("to ", "")}...`
                              : person === "tu"
                              ? `you ${currentVerb.meaning.replace(
                                  "to ",
                                  ""
                                )}...`
                              : person === "lui"
                              ? `he/she ${currentVerb.meaning.replace(
                                  "to ",
                                  ""
                                )}s...`
                              : person === "noi"
                              ? `we ${currentVerb.meaning.replace(
                                  "to ",
                                  ""
                                )}...`
                              : person === "voi"
                              ? `you all ${currentVerb.meaning.replace(
                                  "to ",
                                  ""
                                )}...`
                              : `they ${currentVerb.meaning.replace(
                                  "to ",
                                  ""
                                )}...`
                          }
                          onChange={(e) =>
                            handleInputChange(person, e.target.value)
                          }
                          className={`w-full bg-transparent dark:text-white ${
                            showResults
                              ? value.trim() ===
                                currentVerb.conjugations[person]
                                ? "border-green-500 dark:border-green-400 dark:bg-green-950/20"
                                : "border-red-500 dark:border-red-400 dark:bg-red-950/20"
                              : "dark:border-slate-700"
                          }`}
                        />
                        {showResults && (
                          <p
                            className={`text-sm ${
                              value.trim() === currentVerb.conjugations[person]
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {currentVerb.conjugations[person]}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
                {showHint && hintVerb && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Hint: {hintVerb.infinitive} ({hintVerb.meaning})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {Object.entries(hintVerb.conjugations).map(
                        ([person, conjugation]) => (
                          <p
                            key={person}
                            className="text-sm text-blue-600 dark:text-blue-400"
                          >
                            {person}: {conjugation}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={toggleHint}
                  className="w-full sm:w-28 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={loadNewVerb}
                    className="w-full sm:w-28 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Skip
                  </Button>
                  <Button onClick={checkAnswers} className="w-full sm:w-28">
                    Check
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Progress
              </h2>
              <p className="text-muted-foreground">
                Score: {score} / {totalAttempts} ({accuracy}% accuracy)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
