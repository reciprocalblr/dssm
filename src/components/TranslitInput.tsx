import React, { useState, useEffect, useRef } from "react";
import { Keyboard, Languages, Loader2 } from "lucide-react";

function getEnglishPronunciation(kannadaStr: string): string {
  const baseConsonants: Record<string, string> = {
    'ಕ': 'k', 'ಖ': 'kh', 'ಗ': 'g', 'ಘ': 'gh', 'ಙ': 'ng',
    'ಚ': 'ch', 'ಛ': 'chh', 'ಜ': 'j', 'ಝ': 'jh', 'ಞ': 'ny',
    'ಟ': 't', 'ಠ': 'th', 'ಡ': 'd', 'ಢ': 'dh', 'ಣ': 'n',
    'ತ': 't', 'ಥ': 'th', 'ದ': 'd', 'ಧ': 'dh', 'ನ': 'n',
    'ಪ': 'p', 'ಫ': 'ph', 'ಬ': 'b', 'ಭ': 'bh', 'ಮ': 'm',
    'ಯ': 'y', 'ರ': 'r', 'ಲ': 'l', 'ವ': 'v', 'ಶ': 'sh', 'ಷ': 'sh', 'ಸ': 's', 'ಹ': 'h', 'ಳ': 'l',
    'ಕ್ಷ': 'ksh', 'ಜ್ಞ': 'jny'
  };

  const vowelSigns: Record<string, string> = {
    'ಾ': 'a', 'ಿ': 'i', 'ೀ': 'ee', 'ು': 'u', 'ೂ': 'oo', 'ೃ': 'ru',
    'ೆ': 'e', 'ೇ': 'ae', 'ೈ': 'ai', 'ೊ': 'o', 'ೋ': 'oo', 'ೌ': 'au',
    'ಂ': 'm', 'ಃ': 'h'
  };

  const pureVowels: Record<string, string> = {
    'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo', 'ಋ': 'ru',
    'ಎ': 'e', 'ಏ': 'ae', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oo', 'ಔ': 'au'
  };

  let res = '';
  let i = 0;
  while (i < kannadaStr.length) {
    const char = kannadaStr[i];
    if (pureVowels[char] !== undefined) {
      res += pureVowels[char];
      i++;
    } else if (baseConsonants[char] !== undefined) {
      const cons = baseConsonants[char];
      i++;
      if (i < kannadaStr.length && kannadaStr[i] === '್') {
        res += cons;
        i++;
      } else if (i < kannadaStr.length && vowelSigns[kannadaStr[i]] !== undefined) {
        res += cons + vowelSigns[kannadaStr[i]];
        i++;
      } else {
        res += cons + 'a';
      }
    } else if (vowelSigns[char] !== undefined) {
      res += vowelSigns[char];
      i++;
    } else {
      res += char;
      i++;
    }
  }
  return res;
}

interface TranslitInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
}

export default function TranslitInput({
  value,
  onChange,
  placeholder = "",
  className = "",
  required = false,
  id,
}: TranslitInputProps) {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tracks the details of the active word before the caret
  const [activeWordInfo, setActiveWordInfo] = useState<{
    word: string;
    startIdx: number;
    endIdx: number;
  } | null>(null);

  // Track the last replacement for quick undo via Backspace
  const lastReplacementRef = useRef<{
    original: string;
    replaced: string;
    startIdx: number;
  } | null>(null);

  // Update active word based on text value and cursor position
  const updateActiveWord = () => {
    if (!inputRef.current || !enabled) {
      setActiveWordInfo(null);
      setActiveWord("");
      return;
    }

    const text = value;
    const selectionStart = inputRef.current.selectionStart ?? 0;
    const beforeCursor = text.slice(0, selectionStart);

    // Active word is the word before the cursor, ending at the cursor
    // Find the index of the last whitespace before the cursor
    const lastSpaceIdx = Math.max(
      beforeCursor.lastIndexOf(" "),
      beforeCursor.lastIndexOf("\n"),
    );
    const startIdx = lastSpaceIdx + 1;
    const word = beforeCursor.slice(startIdx);

    // Only transliterate if it's purely English letters
    if (/^[a-zA-Z]+$/.test(word)) {
      setActiveWordInfo({ word, startIdx, endIdx: selectionStart });
      setActiveWord(word);
    } else {
      setActiveWordInfo(null);
      setActiveWord("");
      setSuggestions([]);
    }
  };

  // Listen to input selection and cursor movements
  const handleKeyUpAndMouseUp = () => {
    updateActiveWord();
  };

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!activeWord || !enabled) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const url = `https://inputtools.google.com/request?text=${encodeURIComponent(activeWord)}&itc=kn-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (
            data &&
            data[0] === "SUCCESS" &&
            data[1] &&
            data[1][0] &&
            data[1][0][1]
          ) {
            setSuggestions(data[1][0][1]);
          }
        }
      } catch (err) {
        console.error("Transliteration service failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 120); // Quick 120ms debounce for maximum responsiveness

    return () => clearTimeout(delayDebounce);
  }, [activeWord, enabled]);

  // Handle selecting a suggestion
  const selectSuggestion = (chosen: string) => {
    if (!activeWordInfo || !inputRef.current) return;

    const { startIdx, endIdx, word } = activeWordInfo;
    const newVal = value.slice(0, startIdx) + chosen + value.slice(endIdx);
    onChange(newVal);

    // Update cursor position right after the replaced word
    const newCursor = startIdx + chosen.length;
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);

    // Reset suggest states
    setSuggestions([]);
    setActiveWord("");
    setActiveWordInfo(null);
    lastReplacementRef.current = null;
  };

  // Capture keyboard events for space conversion and backspace backtrack
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If enabled, suggestions are available, and Space is pressed:
    if (enabled && e.key === " " && suggestions.length > 0 && activeWordInfo) {
      e.preventDefault();
      const chosen = suggestions[0];
      const { startIdx, endIdx, word } = activeWordInfo;

      const newVal =
        value.slice(0, startIdx) + chosen + " " + value.slice(endIdx);
      onChange(newVal);

      // Position cursor after the added space
      const newCursor = startIdx + chosen.length + 1;
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newCursor, newCursor);
        }
      }, 0);

      // Saved for backtrack undo
      lastReplacementRef.current = {
        original: word,
        replaced: chosen + " ",
        startIdx,
      };

      setSuggestions([]);
      setActiveWord("");
      setActiveWordInfo(null);
      return;
    }

    // Capture Backspace immediately following an auto-transliterated replacement to revert it
    if (
      e.key === "Backspace" &&
      lastReplacementRef.current &&
      inputRef.current
    ) {
      const lastRep = lastReplacementRef.current;
      const selectStart = inputRef.current.selectionStart ?? 0;
      const beforeCursor = value.slice(0, selectStart);
      const expectedReplaced =
        value.slice(0, lastRep.startIdx) + lastRep.replaced;

      // If text exactly matches the replaced string and cursor is right after the space
      if (beforeCursor === expectedReplaced) {
        e.preventDefault();
        // Restore original typed English letters
        const newVal =
          value.slice(0, lastRep.startIdx) +
          lastRep.original +
          value.slice(lastRep.startIdx + lastRep.replaced.length);
        onChange(newVal);

        const newCursor = lastRep.startIdx + lastRep.original.length;
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newCursor, newCursor);
          }
        }, 0);

        // Reset undo track
        lastReplacementRef.current = null;
        return;
      }
    }

    // Clear undo track on any other arbitrary typing
    if (e.key !== "Backspace") {
      lastReplacementRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    // Trigger tick after cursor shifts natively
    setTimeout(() => {
      updateActiveWord();
    }, 0);
  };

  return (
    <div className="relative w-full">
      {/* Input wrapper with status integration */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          id={id}
          required={required}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUpAndMouseUp}
          onMouseUp={handleKeyUpAndMouseUp}
          placeholder={placeholder}
          className={`${className} font-kannada-sans text-[15px] pr-10`}
        />

        {/* Languages/Keyboard toggle button */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setEnabled(!enabled);
            setSuggestions([]);
            setActiveWord("");
            setActiveWordInfo(null);
            if (inputRef.current) inputRef.current.focus();
          }}
          title={
            enabled
              ? "Switch to English Only"
              : "Switch to Kannada Phonetic Typing"
          }
          className={`absolute right-2 px-1.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer border ${
            enabled
              ? "bg-[#ff7a00]/10 border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/20"
              : "bg-stone-800/10 border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-500"
          }`}
        >
          {enabled ? (
            <>
              <Languages className="w-3 h-3 text-[#ff7a00]" />
              <span className="font-kannada-sans">ಕನ್ನಡ</span>
            </>
          ) : (
            <>
              <Keyboard className="w-3 h-3 text-stone-500" />
              <span>EN</span>
            </>
          )}
        </button>
      </div>

      {/* Floating phonetic suggestions drawer with high-contrast light parchment styling */}
      {enabled && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-[#faf5ef] border-2 border-[#ff7a00]/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-100 p-2.5 flex flex-col gap-2 min-w-[280px]">
          <div className="flex items-center justify-between px-1 text-[10px] text-[#8c6d62] border-b border-[#e6dbcf] pb-1.5 font-sans font-bold">
            <span className="font-extrabold flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-pulse"></span>
              KANNADA TRANSLITERATION CHOICES
            </span>
            <span className="text-[8px] font-medium opacity-80">
              [Space] selects first choice, [Backspace] reverts
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5 max-h-[160px] overflow-y-auto">
            {suggestions.map((cand, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectSuggestion(cand)}
                className={`px-3 py-1.5 text-[15px] font-medium font-kannada-serif rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                  idx === 0
                    ? "bg-[#ff7a00] text-white border-[#ea580c] shadow-md transform scale-[1.02]"
                    : "bg-white text-stone-900 border-[#dcd1c4] hover:bg-[#ff7a00]/10 hover:border-[#ff7a00] hover:text-[#ff7a00]"
                }`}
              >
                {idx === 0 && (
                  <span className="text-[10px] opacity-75 font-mono">1.</span>
                )}
                <span>{cand}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono tracking-wide ${
                  idx === 0 
                    ? "bg-[#ea580c] text-white border-[#c2410c]" 
                    : "bg-[#f5ebe0] text-[#8c6d62] border-[#e6dbcf]"
                }`}>
                  {getEnglishPronunciation(cand)}
                </span>
              </button>
            ))}

            {/* Always provide option to keep original English spelling */}
            <button
              type="button"
              onClick={() => {
                if (activeWordInfo) {
                  // Simply clear suggestions for this word to keep it English
                  setSuggestions([]);
                  setActiveWord("");
                  setActiveWordInfo(null);
                }
              }}
              className="px-3 py-1.5 text-xs rounded-lg font-bold border bg-stone-100 border-[#dcd1c4] text-stone-700 hover:text-stone-900 hover:bg-stone-200 cursor-pointer transition-all"
            >
              Keep "{activeWord}"
            </button>

            {isLoading && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold px-2 px-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>typing...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
