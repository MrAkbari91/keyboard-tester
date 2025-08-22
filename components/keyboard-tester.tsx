"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, Keyboard, Mouse, RotateCcw } from "lucide-react"
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

const KEYBOARD_LAYOUT = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Meta", "Alt", "Space", "Alt", "Meta", "Menu", "Ctrl"],
]

const KEY_WIDTHS: Record<string, string> = {
  Backspace: "w-20",
  Tab: "w-16",
  CapsLock: "w-20",
  Enter: "w-20",
  Shift: "w-24",
  Ctrl: "w-16",
  Alt: "w-16",
  Meta: "w-16",
  Menu: "w-16",
  Space: "w-80",
  Escape: "w-16",
}

export function KeyboardTester() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [keyHistory, setKeyHistory] = useState<KeyPress[]>([])
  const [mouseHistory, setMouseHistory] = useState<MouseEvent[]>([])
  const [activeTab, setActiveTab] = useState("both")
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
    const baseClass =
      "h-12 border-2 rounded-md flex items-center justify-center text-sm font-medium transition-all duration-150 select-none"
    const widthClass = KEY_WIDTHS[key] || "w-12"

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
    else if (key === "Escape") keyCode = "Escape"
    else if (key.startsWith("F")) keyCode = key
    else keyCode = `Key${key.toUpperCase()}`

    const isPressed = pressedKeys.has(keyCode) || pressedKeys.has(`${keyCode.replace("Left", "Right")}`)

    if (isPressed) {
      return `${baseClass} ${widthClass} bg-primary text-primary-foreground shadow-lg scale-95 border-primary`
    }

    return `${baseClass} ${widthClass} bg-secondary hover:bg-accent border-border`
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Keyboard & Mouse Tester</h1>
            <p className="text-muted-foreground">Test your keyboard keys and mouse buttons</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={clearHistory}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="both" className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              <Mouse className="h-4 w-4" />
              Both
            </TabsTrigger>
            <TabsTrigger value="keyboard" className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              Keyboard
            </TabsTrigger>
            <TabsTrigger value="mouse" className="flex items-center gap-2">
              <Mouse className="h-4 w-4" />
              Mouse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="both" className="space-y-6">
            {/* Keyboard Layout */}
            <Card>
              <CardHeader>
                <CardTitle>Virtual Keyboard</CardTitle>
                <CardDescription>Press any key on your physical keyboard to see it highlighted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1 justify-center">
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

            {/* Mouse Tester */}
            <Card>
              <CardHeader>
                <CardTitle>Mouse Tester</CardTitle>
                <CardDescription>Click anywhere in this area to test mouse buttons</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="h-40 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onMouseDown={handleMouseDown}
                >
                  <p className="text-muted-foreground">Click here to test mouse buttons</p>
                </div>
              </CardContent>
            </Card>

            {/* Event History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Keyboard Events</CardTitle>
                  <CardDescription>Last 10 key presses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {keyHistory.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No key presses yet</p>
                    ) : (
                      keyHistory.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{event.key}</Badge>
                            <span className="text-sm text-muted-foreground">{event.code}</span>
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

              <Card>
                <CardHeader>
                  <CardTitle>Mouse Events</CardTitle>
                  <CardDescription>Last 10 mouse clicks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {mouseHistory.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No mouse clicks yet</p>
                    ) : (
                      mouseHistory.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{event.button}</Badge>
                            <span className="text-sm text-muted-foreground">
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
            {/* Keyboard Only View */}
            <Card>
              <CardHeader>
                <CardTitle>Virtual Keyboard</CardTitle>
                <CardDescription>Press any key on your physical keyboard to see it highlighted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1 justify-center">
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

            <Card>
              <CardHeader>
                <CardTitle>Keyboard Events</CardTitle>
                <CardDescription>Detailed key press information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {keyHistory.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Press any key to start testing</p>
                  ) : (
                    keyHistory.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {event.key}
                          </Badge>
                          <div className="text-sm">
                            <div className="font-medium">Key: {event.key}</div>
                            <div className="text-muted-foreground">Code: {event.code}</div>
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
            {/* Mouse Only View */}
            <Card>
              <CardHeader>
                <CardTitle>Mouse Tester</CardTitle>
                <CardDescription>Click anywhere in the testing area below</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="h-60 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onMouseDown={handleMouseDown}
                >
                  <div className="text-center">
                    <Mouse className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Click here to test mouse buttons</p>
                    <p className="text-sm text-muted-foreground mt-1">Try left, right, and middle clicks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mouse Events</CardTitle>
                <CardDescription>Detailed mouse click information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {mouseHistory.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Click anywhere to start testing</p>
                  ) : (
                    mouseHistory.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {event.button}
                          </Badge>
                          <div className="text-sm">
                            <div className="font-medium">Button: {event.button}</div>
                            <div className="text-muted-foreground">
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

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground border-t pt-6">
          <p className="mt-1">Test your hardware with confidence.</p>
          <p className="mt-2">© 2025 Keyboard & Mouse Tester. Built with Next.js and Tailwind CSS. </p>
        </footer>
      </div>
    </div>
  )
}
