'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster, toast } from "react-hot-toast";

type JudgingPanelClientProps = {
  judgingPanelPasscode: number;
  eventId: number;
  divisionId: number;
  roundId: number;
  roundHeatId: number;
  personnelId: number;
};

type AthleteRun = {
  athlete_id: number;
  bib: number;
  runs: {
    run_num: number;
    round_heat_id: number;
    seeding: number;
    score: number;
  }[];
}

type BestScore = {
  bib_num: number;
  best_run_score: number;
}

export default function JudgingPanelClient({
  judgingPanelPasscode,
  eventId,
  divisionId,
  roundId,
  roundHeatId,
  personnelId,
}: JudgingPanelClientProps) {
  const [inputCode, setInputCode] = useState('');
  const [verified, setVerified] = useState(false);
  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "CLEAR",
  ] as const;

  const [athletes, setAthletes] = useState<AthleteRun[]>([]);
  // const [selectedAthlete, setSelectedAthlete] = useState<number>();
  const [score, setScore] = useState("");
  const [runNum, setRunNum] = useState<number | null>(null);
  const [selected, setSelected] = useState<{
    bib: number;
    run_num: number;
    athlete_id: number;
  } | null>(null);
  const [eventIsFinished, setEventIsFinished] = useState(false);
  const [submittedScores, setSubmittedScores] = useState<Record<string, number>>({}); 
  const [bestScores, setBestScores] = useState<BestScore[]>([]);
  const [submissionFlag, setSubmissionFlag] = useState<boolean>(false);

  useEffect(() => {
    if (!eventId) return;

    fetch(`/api/athletes-and-score?personnel_id=${personnelId}&round_heat_id=${roundHeatId}`)
      .then(async (res) => {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          return res.json();
        }
        throw new Error('Invalid JSON response');
      })      
      .then((data) => {
        console.log("API athletes data:", data);
        setAthletes(data.athletes);
        // setEventIsFinished(data.event.status === "COMPLETE");
      })
      .catch((err) => {
        console.error("Failed to load athletes data and scores", err);
        setAthletes([]);
      });
  }, []);

  useEffect(() => {
    if (!roundHeatId) return;
    fetch(`/api/best-run-score-per-judge?round_heat_id=${roundHeatId}&personnel_id=${personnelId}`)
      .then((res => res.ok ? res.json() : []))
      .then((data: BestScore[]) => setBestScores(data))
      .catch(err => {
        console.error("Failed to load best scores", err);
        setBestScores([]);
      });
  }, [personnelId, roundHeatId, submissionFlag]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/\D/g, '');
    setInputCode(sanitized);
  };

  function getSpecificScore (round_heat_id: number, personnel_id: number, athlete_id: number, run_num: number) {
      fetch(`/api/athlete-run-score-per-judge?round_heat_id=${round_heat_id}&personnel_id=${personnel_id}&run_num=${run_num}&=${athlete_id}`)
      .then((res => res.ok ? res.json() : null))
      .then((data: Record<string, number>) => setSubmittedScores(data))
      .catch(err => {
        console.error("Failed to load scores from database", err);
      });
  }

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedCode = inputCode.replace(/\D/g, '');

    if (sanitizedCode === String(judgingPanelPasscode)) {
      setVerified(true);
    } else {
      toast.error("Invalid access code");
      setInputCode('');
    }
  };

  if (!verified) {
    return (
    <div className=" min-h-screen flex flex-col justify-center py-12 px-4">
      <Toaster />
      <div className="max-w-xl w-full mx-auto bg-white border border-gray-200 shadow-md">
        <div className="p-8 flex flex-col items-center">
          <Image
            src="/assets/goggles_borderless.png"
            alt="SnowScore Logo"
            width={240}
            height={240}
            className="mb-6"
            priority
          />

          <h1 className="text-3xl font-extrabold text-gray-800 mb-12">
            Judging Panel
          </h1>

          <form onSubmit={handlePasscodeSubmit} className="w-">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Validate access
            </label>

            <input
              type="password"
              value={inputCode}
              onChange={handleCodeChange}
              inputMode="numeric"
              pattern="\d*"
              className="block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Access code"
            />

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors duration-200"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

  const handleClearButtonClick = (value: string) => {
    if (value === "CLEAR") {
      setScore("");
    } else {
      setScore((prev) => (prev + value).slice(0, 3));
    }
  };

  const handleScoreSubmit = async () => {

    if (Number(score) > 100){
      toast.error("Error: score exceeds 100", {position: "bottom-center"});
      setScore("");
      return;
    }

    if (runNum === null){
      toast.error("Select a run", {position: "bottom-center"});
      return;
    }

    if (score === ""){
      toast.error("Enter a score to submit", {position: "bottom-center"});
      return;
    }


    
    console.log("SUBMITTING:", {
      roundHeatId,
      runNum,
      personnelId,
      score,
    });

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        round_heat_id: roundHeatId,
        run_num: selected?.run_num,
        personnel_id: personnelId,
        score: parseFloat(score),
        athlete_id: selected?.athlete_id,
      }),
    });
        console.log(`SELECTED RUN_NUM: ${selected?.run_num}, SCORE: ${score}, PERSONNEL_ID: ${personnelId}, ATHLETE_ID: ${selected?.athlete_id}, ROUND_HEAT_ID: ${roundHeatId}`)

    const data = await response.json();
    console.log("Score submission response:", data);

    if (response.ok) {
      toast.success("Score submitted successfully", {position: "bottom-center"});
      setSubmittedScores((prev) => ({
        ...prev,
        [`${selected?.athlete_id}-${runNum}`]: parseFloat(score),
      }));
      setSubmissionFlag(!submissionFlag);
      setScore("");
    }
    if (eventIsFinished) {
      alert("Event is finished, cannot submit scores.");
      return;
    }
    if (!roundHeatId || !runNum || !score) {
      alert("Please select an athlete and enter a score.");
      return;
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex w-full h-screen">

        {/* Athlete List
        make the top row sticky to vertical scrolling*/}
        <div className="w-[30%] p-4 space-y-4 pt-[2%] pb-[2%] ">
          <div className="w-full h-full border border-black overflow-x-auto">
            <div className=" top-0 z-10 sticky inline-grid grid-flow-col auto-cols-[minmax(7rem,1fr)] gap-0 mb-0 text-center text-2xl font-bold border-b-1 border-solid border-black">
              <div className="sticky left-0 bg-white border-r-1 border-black border-solid">BIB</div>
              {athletes.length > 0 &&
                athletes[0].runs.map((run) => (
                  <div className=" bg-white border-r-1 border-black border-solid"
                  key={run.run_num}>RUN {run.run_num}</div>
                ))}
            </div>

            {athletes.map(({ athlete_id, bib, runs }) => (
              <div
                key={athlete_id}
                className="inline-grid grid-flow-col auto-cols-[minmax(7rem,2fr)] gap-0 text-center mb-0 h-[5%] font-semibold text-2xl"
              >
                <div className="border-black border-solid border-b-1 border-r-1 flex items-center justify-center sticky left-0 bg-white">{bib}</div>
                {runs.map(({ run_num, score }) => {
                  const key = `${athlete_id}-${run_num}`;
                  const isActive =
                    selected?.athlete_id === athlete_id && selected.run_num === run_num;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            console.log(`Selected athlete: ${bib}, run: ${run_num}`);
                            setRunNum(run_num);
                            setSelected({ bib, run_num, athlete_id });
                          }}
                          className={`
                            flex items-center justify-center
                            ${isActive
                              ? "bg-blue-500 text-white font-bold border-r-1 border-black border-solid border-b-1"
                              : "bg-gray-200 hover:bg-gray-300 border-r-1 border-black border-solid border-b-1"}
                          `}
                        >
                          {score ?? (submittedScores[key] ?? (submittedScores[key] ?? "+"))}
                        </button>
                      );
                  })}
                </div>
              ))}
          </div>
        </div>

        {/* Score Board*/}
        <div className="w-[60%] pt-[2%] pb-[2%] mr-0 flex flex-col items-center h-full">
          <div className="h-[30%] w-[100%] flex justify-center ">
            {/* Left side arrows */}
            <div className="flex flex-col items-center justify-center gap-[5%] mr-[5%]">
              <button
                className="p-[2%] border border-black rounded bg-white active:bg-gray-200"
                aria-label="Previous Bib"
              >
                <ChevronUp className="h-27 w-27" />
              </button>
              <button
                className="p-[2%] border border-black rounded bg-white active:bg-gray-200"
                aria-label="Next Bib"
              >
                <ChevronDown className="h-27 w-27" />
              </button>
            </div>

            {/* Score Display */}
            <div className="border-solid border-black border-1 mb-4 w-[50%]">
              {selected?.bib != null && selected?.run_num != null ? (
                <div className="flex">
                  <div className="text-3xl font-bold bg-green-100 text-center h-[20%] border-black border-solid border-b-1 flex items-center justify-center w-1/2">
                    BIB {selected.bib} 
                  </div>
                  <div className="text-3xl font-bold bg-green-100 text-center h-[20%] border-black border-solid border-b-1 flex items-center justify-center w-1/2 border-l-1">
                    RUN {selected.run_num}
                  </div>
                </div>
              ) : (
                <div className="flex flex-row w-full">       
                  <div className="text-3xl font-bold bg-green-100 text-center h-[20%] border-black border-solid border-b-1 flex items-center justify-center w-1/2">
                    BIB
                  </div>
                  <div className="text-3xl font-bold bg-green-100 text-center h-[20%] border-black border-solid border-b-1 flex items-center justify-center w-1/2 border-l-1">
                    RUN
                  </div>
                </div>
              )}
              <div className="text-[8vw] font-bold bg-green-100 w-full text-center h-[85%] flex items-center justify-center">
                {score}
              </div>
            </div>

          {/* Right side arrows */}
          <div className="flex flex-col items-center justify-center gap-[5%] ml-[5%]">
            <button
              className="p-[3%] border border-black rounded bg-white active:bg-gray-200"
              aria-label="Right side competitor"
            >
              <ChevronRight  className="h-27 w-27" />
            </button>
            <button
              className="p-[3%] border border-black rounded bg-white active:bg-gray-200"
              aria-label="Left side competitor"
            >
              <ChevronLeft className="h-27 w-27" />
            </button>
          </div>

          </div>


          {/* Submit Button */}
          <button
            onClick={handleScoreSubmit}
            disabled={eventIsFinished}
            className="bg-orange-600 text-black w-[50%] h-[10%] text-5xl font-bold border-solid border-black border-1 active:bg-orange-700"
          >
            {eventIsFinished ? "Event Finished" : "SUBMIT"}
          </button>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-0 w-full mt-4 h-[60%]">
            {keys.map((key) => (
              <button
                key={key}
                onClick={() => !eventIsFinished && handleClearButtonClick(key)}
                className={`btn text-5xl rounded-[0] border-solid border-black h-full ${
                  key === "CLEAR" ? "col-span-2 bg-yellow-400" : "bg-yellow-300"
                } ${eventIsFinished ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={eventIsFinished}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
         
        {/* Best Scores List */}
        <div className="w-[20%] p-4 space-y-4 pt-[2%] pb-[2%] text-3xl font-bold ">
          <div className="w-full h-full border border-black overflow-auto">
            <div className="grid grid-cols-2 gap-0 text-center mb-0 border-b-1 border-black border-solid min-h-[2rem] text-2xl font-bold sticky top-0">
              <div className="border-r-1 border-black border-solid bg-white">
                BIB</div>
              <div className="bg-white">BEST</div>
            </div>
            {/* rows */}
            {bestScores.map(({ bib_num, best_run_score }) => (
              <div
                key={bib_num}
                className="grid grid-cols-2 gap-0 text-center mb-0 h-[5%] border-b-1 border-black border-solid font-semibold"
              >
                <div className="bg-white p-1 border-r-1 border-black border-solid">{bib_num}</div>
                <div className="bg-green-100 p-1">{Number(best_run_score).toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}