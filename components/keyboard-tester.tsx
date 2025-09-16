"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Keyboard, Mouse, RotateCcw, Zap, Activity, Target, Settings, Monitor, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"

interface KeyPress {
  key: string
  code: string
  timestamp: number
}

interface MouseEvent {
  button: string
  x: number
  y: number
  timestamp: number
}

// Different keyboard layouts
const KEYBOARD_LAYOUTS = {
  full: [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "PrintScreen", "ScrollLock", "Pause"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace", "Insert", "Home", "PageUp"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "Delete", "End", "PageDown"],
    ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift", "↑"],
    ["Ctrl", "Meta", "Alt", "Space", "Alt", "Meta", "Menu", "Ctrl", "←", "↓", "→"],
  ],
  "75%": [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Delete"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace", "Home"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "PageUp"],
    ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter", "PageDown"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift", "↑"],
    ["Ctrl", "Meta", "Alt", "Space", "Alt", "Meta","Ctrl", "←", "↓", "→"],
  ],
  "65%": [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace", "Delete"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Ctrl", "Meta", "Alt", "Space", "Alt", "Meta", "Ctrl"],
  ],
  "60%": [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Ctrl", "Meta", "Alt", "Space", "Alt", "Meta", "Ctrl"],
  ],
}

const KEY_WIDTHS: Record<string, string> = {
  Backspace:"px-4",
  Tab:"px-6",
  CapsLock:"px-4",
  Enter:"px-9",
  Shift:"px-12",
  Ctrl:"px-6",
  Alt:"px-4",
  Meta:"px-4",
  Menu:"px-4",
  Space:"px-38",
  Esc:"px-3",
  Delete:"px-4",
  Insert:"px-4",
  Home:"px-4",
  End:"px-4",
  PageUp:"px-4",
  PageDown:"px-4",
  PrintScreen:"px-4",
  ScrollLock:"px-4",
  Pause:"px-4",
  "\\":"px-8",
  "←":"px-6",
  "→":"px-6",
  "↑":"px-6",
  "↓":"px-6",
}

export function KeyboardTester() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [keyHistory, setKeyHistory] = useState<KeyPress[]>([])
  const [mouseHistory, setMouseHistory] = useState<MouseEvent[]>([])
  const [activeTab, setActiveTab] = useState("both")
  const [keyboardSize, setKeyboardSize] = useState<keyof typeof KEYBOARD_LAYOUTS>("full")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault()
    const key = event.key === " " ? "Space" : event.key
    const code = event.code

    setPressedKeys((prev) => new Set(prev).add(code))
    setKeyHistory((prev) => [{ key, code, timestamp: Date.now() }, ...prev.slice(0, 9)])
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const code = event.code
    setPressedKeys((prev) => {
      const newSet = new Set(prev)
      newSet.delete(code)
      return newSet
    })
  }, [])

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const buttonNames = ["Left", "Middle", "Right"]
    const buttonName = buttonNames[event.button] || `Button ${event.button}`

    setMouseHistory((prev) => [
      {
        button: buttonName,
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 9),
    ])
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousedown", handleMouseDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousedown", handleMouseDown)
    }
  }, [handleKeyDown, handleKeyUp, handleMouseDown])

  const clearHistory = () => {
    setKeyHistory([])
    setMouseHistory([])
    setPressedKeys(new Set())
  }

  const getKeyClass = (key: string) => {
    const baseClass = "h-12 flex items-center justify-center text-sm font-medium select-none key-instant"
    const widthClass = KEY_WIDTHS[key] ||"px-5"

    // Convert display key to code for checking if pressed
    let keyCode = ""
    if (key === "Space") keyCode = "Space"
    else if (key === "Enter") keyCode = "Enter"
    else if (key === "Backspace") keyCode = "Backspace"
    else if (key === "Tab") keyCode = "Tab"
    else if (key === "CapsLock") keyCode = "CapsLock"
    else if (key === "Shift") keyCode = "ShiftLeft"
    else if (key === "Ctrl") keyCode = "ControlLeft"
    else if (key === "Alt") keyCode = "AltLeft"
    else if (key === "Meta") keyCode = "MetaLeft"
    else if (key === "Menu") keyCode = "ContextMenu"
    else if (key === "Esc") keyCode = "Esc"
    else if (key === "Delete") keyCode = "Delete"
    else if (key === "Insert") keyCode = "Insert"
    else if (key === "Home") keyCode = "Home"
    else if (key === "End") keyCode = "End"
    else if (key === "PageUp") keyCode = "PageUp"
    else if (key === "PageDown") keyCode = "PageDown"
    else if (key === "PrintScreen") keyCode = "PrintScreen"
    else if (key === "ScrollLock") keyCode = "ScrollLock"
    else if (key === "Pause") keyCode = "Pause"
    else if (key === "←") keyCode = "ArrowLeft"
    else if (key === "→") keyCode = "ArrowRight"
    else if (key === "↑") keyCode = "ArrowUp"
    else if (key === "↓") keyCode = "ArrowDown"
    else if (key.startsWith("F")) keyCode = key
    else if (key === "`") keyCode = "Backquote"
    else if (key === "-") keyCode = "Minus"
    else if (key === "=") keyCode = "Equal"
    else if (key === "[") keyCode = "BracketLeft"
    else if (key === "]") keyCode = "BracketRight"
    else if (key === "\\") keyCode = "Backslash"
    else if (key === ";") keyCode = "Semicolon"
    else if (key === "'") keyCode = "Quote"
    else if (key === ",") keyCode = "Comma"
    else if (key === ".") keyCode = "Period"
    else if (key === "/") keyCode = "Slash"
    else keyCode = `Key${key.toUpperCase()}`

    const isPressed = pressedKeys.has(keyCode) || pressedKeys.has(`${keyCode.replace("Left", "Right")}`)

    if (isPressed) {
      return `${baseClass} ${widthClass} key-pressed border-2 border-orange-400 rounded-[20px]`
    }

    return `${baseClass} ${widthClass} glass-card text-foreground hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 dark:hover:border-orange-600 btn-hover`
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-6">
        <header className="text-center py-8">
          <div className="glass-card max-w-4xl mx-auto p-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold gradient-text mb-4">
              Professional Hardware Tester
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-6">
              Test your keyboard and mouse with precision using our advanced, colorful interface designed for
              professionals and enthusiasts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="glass-card btn-hover bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:text-orange-700 cursor-pointer"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="glass-card btn-hover bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:text-green-700 cursor-pointer"
                onClick={clearHistory}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Clear History
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card btn-hover border-orange-300/50 dark:border-orange-600/50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-[20px]">
                  <Keyboard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-1 text-foreground">Keyboard Events</h3>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{keyHistory.length}</p>
              <p className="text-sm text-muted-foreground">Keys Pressed</p>
            </CardContent>
          </Card>

          <Card className="glass-card btn-hover border-green-300/50 dark:border-green-600/50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-[20px]">
                  <Mouse className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-1 text-foreground">Mouse Events</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{mouseHistory.length}</p>
              <p className="text-sm text-muted-foreground">Clicks Detected</p>
            </CardContent>
          </Card>

          <Card className="glass-card btn-hover border-blue-300/50 dark:border-blue-600/50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-[20px] animate-pulse">
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-1 text-foreground">Active Keys</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{pressedKeys.size}</p>
              <p className="text-sm text-muted-foreground">Currently Pressed</p>
            </CardContent>
          </Card>

          <Card className="glass-card btn-hover border-orange-300/50 dark:border-orange-600/50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-[20px]">
                  <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg mb-1 text-foreground">Keyboard Size</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{keyboardSize.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">Layout Active</p>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-[20px]">
                <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg text-foreground">Testing Controls</h3>
                <p className="text-sm text-muted-foreground">Configure your testing environment</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Keyboard Size:</label>
                <Select
                  value={keyboardSize}
                  onValueChange={(value: keyof typeof KEYBOARD_LAYOUTS) => setKeyboardSize(value)}
                >
                  <SelectTrigger className="w-24 glass-card border-blue-300 dark:border-blue-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="75%">75%</SelectItem>
                    <SelectItem value="65%">65%</SelectItem>
                    <SelectItem value="60%">60%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="glass-card p-2 h-auto border-blue-300 dark:border-blue-600">
              <TabsTrigger
                value="both"
                className="flex items-center gap-3 px-6 py-3 text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-[16px]"
              >
                <Keyboard className="h-8 w-8" />
                <Mouse className="h-8 w-8" />
                Complete Test
              </TabsTrigger>
              <TabsTrigger
                value="keyboard"
                className="flex items-center gap-3 px-6 py-3 text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-[16px]"
              >
                <Keyboard className="h-8 w-8" />
                Keyboard Only
              </TabsTrigger>
              <TabsTrigger
                value="mouse"
                className="flex items-center gap-3 px-6 py-3 text-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-[16px]"
              >
                <Mouse className="h-8 w-8" />
                Mouse Only
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="both" className="space-y-6">
            <div className="space-y-6">
              <Card className="glass-card border-orange-300/50 dark:border-orange-600/50">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-[20px]">
                      <Keyboard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="font-serif text-2xl text-foreground">
                      Virtual Keyboard ({keyboardSize.toUpperCase()})
                    </CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    Press any key on your physical keyboard to see it highlighted instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 p-4 bg-gradient-to-br from-orange-50/30 to-green-50/30 dark:from-orange-950/20 dark:to-green-950/20 rounded-[20px] border-2 border-orange-200/30 dark:border-orange-700/30">
                    {KEYBOARD_LAYOUTS[keyboardSize].map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1">
                        {row.map((key, keyIndex) => (
                          <div key={`${rowIndex}-${keyIndex}`} className={getKeyClass(key)}>
                            {key === "Space" ? "" : key}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-300/50 dark:border-green-600/50">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-[20px]">
                      <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="font-serif text-2xl text-foreground">Mouse Testing</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">Click to test mouse buttons</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div
                    className="h-48 bg-gradient-to-br from-green-50/30 to-blue-50/30 dark:from-green-950/20 dark:to-blue-950/20 rounded-[20px] border-2 border-dashed border-green-300/50 dark:border-green-600/50 flex items-center justify-center cursor-pointer hover:bg-gradient-to-br hover:from-green-100/50 hover:to-blue-100/50 dark:hover:from-green-900/30 dark:hover:to-blue-900/30 transition-all duration-300 group btn-hover"
                    onMouseDown={handleMouseDown}
                  >
                    <div className="text-center group-hover:scale-105 transition-transform duration-300">
                      <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-[20px] mx-auto mb-3 w-fit">
                        <Mouse className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">Click Here</p>
                      <p className="text-sm text-muted-foreground">Test all buttons</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-orange-300/50 dark:border-orange-600/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-[20px]">
                      <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl text-foreground">Keyboard Events</CardTitle>
                      <CardDescription className="text-muted-foreground">Real-time key press detection</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {keyHistory.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="p-4 bg-orange-100 dark:bg-orange-900/50 rounded-[20px] mx-auto mb-4 w-fit">
                          <Keyboard className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="text-muted-foreground">Press any key to start testing</p>
                      </div>
                    ) : (
                      keyHistory.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50/80 to-transparent dark:from-orange-950/30 dark:to-transparent rounded-[20px] border-2 border-orange-200/30 dark:border-orange-700/30 btn-hover"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className="text-base px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 rounded-[16px]"
                            >
                              {event.key}
                            </Badge>
                            <span className="text-sm text-muted-foreground font-mono">{event.code}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-300/50 dark:border-green-600/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-[20px]">
                      <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-2xl text-foreground">Mouse Events</CardTitle>
                      <CardDescription className="text-muted-foreground">Real-time click detection</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mouseHistory.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-[20px] mx-auto mb-4 w-fit">
                          <Mouse className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-muted-foreground">Click anywhere to start testing</p>
                      </div>
                    ) : (
                      mouseHistory.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/80 to-transparent dark:from-green-950/30 dark:to-transparent rounded-[20px] border-2 border-green-200/30 dark:border-green-700/30 btn-hover"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className="text-base px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 rounded-[16px]"
                            >
                              {event.button}
                            </Badge>
                            <span className="text-sm text-muted-foreground font-mono">
                              ({event.x}, {event.y})
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="keyboard" className="space-y-6">
            <Card className="glass-card border-orange-300/50 dark:border-orange-600/50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-[20px]">
                    <Keyboard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="font-serif text-2xl text-foreground">
                    Virtual Keyboard ({keyboardSize.toUpperCase()})
                  </CardTitle>
                </div>
                <CardDescription className="text-lg text-muted-foreground">
                  Press any key on your physical keyboard to see it highlighted instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 p-6 bg-gradient-to-br from-orange-50/30 to-green-50/30 dark:from-orange-950/20 dark:to-green-950/20 rounded-[20px] border-2 border-orange-200/30 dark:border-orange-700/30">
                  {KEYBOARD_LAYOUTS[keyboardSize].map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1">
                      {row.map((key, keyIndex) => (
                        <div key={`${rowIndex}-${keyIndex}`} className={getKeyClass(key)}>
                          {key === "Space" ? "" : key}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-orange-300/50 dark:border-orange-600/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-[20px]">
                    <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="font-serif text-xl text-foreground">Detailed Keyboard Events</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Comprehensive key press information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-hidden">
                  {keyHistory.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="p-6 bg-orange-100 dark:bg-orange-900/50 rounded-[20px] mx-auto mb-6 w-fit">
                        <Keyboard className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-lg text-muted-foreground">Press any key to start testing</p>
                    </div>
                  ) : (
                    keyHistory.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50/80 to-transparent dark:from-orange-950/30 dark:to-transparent rounded-[20px] border-2 border-orange-200/30 dark:border-orange-700/30 btn-hover"
                      >
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="secondary"
                            className="text-lg px-4 py-2 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 rounded-[16px]"
                          >
                            {event.key}
                          </Badge>
                          <div className="text-sm">
                            <div className="font-medium text-foreground">Key: {event.key}</div>
                            <div className="text-muted-foreground font-mono">Code: {event.code}</div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mouse" className="space-y-6">
            <Card className="glass-card border-green-300/50 dark:border-green-600/50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-[20px]">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="font-serif text-2xl text-foreground">Mouse Testing Zone</CardTitle>
                </div>
                <CardDescription className="text-lg text-muted-foreground">
                  Click anywhere in the testing area below to verify all mouse buttons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="h-64 bg-gradient-to-br from-green-50/30 to-blue-50/30 dark:from-green-950/20 dark:to-blue-950/20 rounded-[20px] border-2 border-dashed border-green-300/50 dark:border-green-600/50 flex items-center justify-center cursor-pointer hover:bg-gradient-to-br hover:from-green-100/50 hover:to-blue-100/50 dark:hover:from-green-900/30 dark:hover:to-blue-900/30 transition-all duration-300 group btn-hover"
                  onMouseDown={handleMouseDown}
                >
                  <div className="text-center group-hover:scale-105 transition-transform duration-300">
                    <div className="p-6 bg-green-100 dark:bg-green-900/50 rounded-[20px] mx-auto mb-6 w-fit">
                      <Mouse className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-xl font-medium text-green-700 dark:text-green-300 mb-2">
                      Click here to test mouse buttons
                    </p>
                    <p className="text-base text-muted-foreground">Try left, right, and middle clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-green-300/50 dark:border-green-600/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-[20px]">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="font-serif text-xl text-foreground">Detailed Mouse Events</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Comprehensive mouse click information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-hidden">
                  {mouseHistory.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="p-6 bg-green-100 dark:bg-green-900/50 rounded-[20px] mx-auto mb-6 w-fit">
                        <Mouse className="h-12 w-12 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-lg text-muted-foreground">Click anywhere to start testing</p>
                    </div>
                  ) : (
                    mouseHistory.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/80 to-transparent dark:from-green-950/30 dark:to-transparent rounded-[20px] border-2 border-green-200/30 dark:border-green-700/30 btn-hover"
                      >
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="secondary"
                            className="text-lg px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 rounded-[16px]"
                          >
                            {event.button}
                          </Badge>
                          <div className="text-sm">
                            <div className="font-medium text-foreground">Button: {event.button}</div>
                            <div className="text-muted-foreground font-mono">
                              Position: ({event.x}, {event.y})
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-16">
          <div className="glass-card p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-green-100 dark:from-orange-900/50 dark:to-green-900/50 rounded-[20px] animate-float">
                  <Keyboard className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div
                  className="p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 rounded-[20px] animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <Mouse className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div
                  className="p-3 bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/50 dark:to-orange-900/50 rounded-[20px] animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold gradient-text">Professional Hardware Tester</h3>
              <div className="max-w-2xl mx-auto space-y-3">
                <p className="text-foreground/80 text-lg">
                  The ultimate testing solution for keyboards and mice, designed with precision and modern aesthetics.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    Real-time Testing
                  </span>
                  <span className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    Multiple Layouts
                  </span>
                  <span className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    Professional Grade
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-6">
                <p className="text-muted-foreground text-sm">
                  © 2024 Professional Hardware Tester. Built with Next.js, TypeScript, and Tailwind CSS.
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  Engineered for professionals, enthusiasts, and anyone who demands precision in hardware testing.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
