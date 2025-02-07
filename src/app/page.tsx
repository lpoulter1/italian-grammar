"use client";

import { useState, useEffect } from "react";
import { Verb, PersonType, VerbType } from "@/types/verbs";
import { getHintVerb } from "@/utils/conjugation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Italian Verb Practice
          </h1>
          <p className="text-gray-500">
            Master Italian verb conjugations through practice
          </p>
          <div className="text-sm space-y-1">
            <p className="text-blue-600">
              {availableVerbsCount} verbs remaining in current set
            </p>
            {cycleCount > 0 && (
              <p className="text-green-600">
                Completed {cycleCount} full{" "}
                {cycleCount === 1 ? "cycle" : "cycles"} of {totalVerbsInType}{" "}
                verbs
              </p>
            )}
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setSelectedType(value as VerbType)}
        >
          <TabsList className="grid w-full grid-cols-5 mb-8">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {currentVerb.infinitive}
                </CardTitle>
                <CardDescription className="text-center">
                  {currentVerb.meaning} - {currentVerb.type} conjugation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(Object.entries(userAnswers) as [PersonType, string][]).map(
                    ([person, value]) => (
                      <div key={person} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {person}:
                        </label>
                        <div className="relative">
                          <Input
                            value={value}
                            onChange={(e) =>
                              handleInputChange(person, e.target.value)
                            }
                            className={`${
                              showResults
                                ? value.trim() ===
                                  currentVerb.conjugations[person]
                                  ? "border-green-500 bg-green-50"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            disabled={showResults}
                          />
                          {showResults && (
                            <span
                              className={`text-sm mt-1 ${
                                value.trim() ===
                                currentVerb.conjugations[person]
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {currentVerb.conjugations[person]}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {!showResults && (
                  <div className="flex justify-center">
                    <Button
                      onClick={toggleHint}
                      variant="outline"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </Button>
                  </div>
                )}

                {showHint && hintVerb && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-center">
                        Pattern Example: {hintVerb.infinitive} (
                        {hintVerb.meaning})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {Object.entries(hintVerb.conjugations).map(
                          ([person, conjugation]) => (
                            <div key={person} className="flex justify-between">
                              <span className="font-medium">{person}:</span>
                              <span className="text-blue-700">
                                {conjugation}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                {showResults ? (
                  <Button onClick={loadNewVerb} variant="default" size="lg">
                    Next Verb
                  </Button>
                ) : (
                  <Button onClick={checkAnswers} variant="default" size="lg">
                    Check Answers
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="text-center py-6">
            <div className="text-2xl font-semibold">
              Score: {score}/{totalAttempts}
            </div>
            <div className="text-sm text-gray-500">Accuracy: {accuracy}%</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
