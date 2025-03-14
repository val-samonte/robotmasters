import cn from 'classnames'
import React from 'react'

interface Frame {
  x: number
  y: number
}

interface SpriteSheetData {
  frameWidth: number
  frameHeight: number
  frames: Record<string, Frame>
}

const spriteSheetData: SpriteSheetData = {
  frameWidth: 8,
  frameHeight: 8,
  frames: {
    A: { x: 0, y: 0 },
    B: { x: 8, y: 0 },
    C: { x: 16, y: 0 },
    D: { x: 24, y: 0 },
    E: { x: 32, y: 0 },
    F: { x: 40, y: 0 },
    G: { x: 48, y: 0 },
    H: { x: 56, y: 0 },
    I: { x: 64, y: 0 },
    J: { x: 72, y: 0 },
    K: { x: 80, y: 0 },
    L: { x: 88, y: 0 },
    M: { x: 0, y: 8 },
    N: { x: 8, y: 8 },
    O: { x: 16, y: 8 },
    P: { x: 24, y: 8 },
    Q: { x: 32, y: 8 },
    R: { x: 40, y: 8 },
    S: { x: 48, y: 8 },
    T: { x: 56, y: 8 },
    U: { x: 64, y: 8 },
    V: { x: 72, y: 8 },
    W: { x: 80, y: 8 },
    X: { x: 88, y: 8 },
    Y: { x: 0, y: 16 },
    Z: { x: 8, y: 16 },
    a: { x: 16, y: 16 },
    b: { x: 24, y: 16 },
    c: { x: 32, y: 16 },
    d: { x: 40, y: 16 },
    e: { x: 48, y: 16 },
    f: { x: 56, y: 16 },
    g: { x: 64, y: 16 },
    h: { x: 72, y: 16 },
    i: { x: 80, y: 16 },
    j: { x: 88, y: 16 },
    k: { x: 0, y: 24 },
    l: { x: 8, y: 24 },
    m: { x: 16, y: 24 },
    n: { x: 24, y: 24 },
    o: { x: 32, y: 24 },
    p: { x: 40, y: 24 },
    q: { x: 48, y: 24 },
    r: { x: 56, y: 24 },
    s: { x: 64, y: 24 },
    t: { x: 72, y: 24 },
    u: { x: 80, y: 24 },
    v: { x: 88, y: 24 },
    w: { x: 0, y: 32 },
    x: { x: 8, y: 32 },
    y: { x: 16, y: 32 },
    z: { x: 24, y: 32 },
    '0': { x: 32, y: 32 },
    '1': { x: 40, y: 32 },
    '2': { x: 48, y: 32 },
    '3': { x: 56, y: 32 },
    '4': { x: 64, y: 32 },
    '5': { x: 72, y: 32 },
    '6': { x: 80, y: 32 },
    '7': { x: 88, y: 32 },
    '8': { x: 0, y: 40 },
    '9': { x: 8, y: 40 },
    '.': { x: 16, y: 40 },
    ',': { x: 24, y: 40 },
    '!': { x: 32, y: 40 },
    '?': { x: 40, y: 40 },
    ':': { x: 48, y: 40 },
    ';': { x: 56, y: 40 },
    '(': { x: 64, y: 40 },
    ')': { x: 72, y: 40 },
    '[': { x: 80, y: 40 },
    ']': { x: 88, y: 40 },
    '{': { x: 0, y: 48 },
    '}': { x: 8, y: 48 },
    '/': { x: 16, y: 48 },
    '\\': { x: 24, y: 48 },
    '|': { x: 32, y: 48 },
    '+': { x: 40, y: 48 },
    '-': { x: 48, y: 48 },
    '*': { x: 56, y: 48 },
    '=': { x: 64, y: 48 },
    '%': { x: 72, y: 48 },
    '@': { x: 80, y: 48 },
    '#': { x: 88, y: 48 },
    $: { x: 0, y: 56 },
    '&': { x: 8, y: 56 },
    '^': { x: 16, y: 56 },
    '~': { x: 24, y: 56 },
    _: { x: 32, y: 56 },
    '<': { x: 40, y: 56 },
    '>': { x: 48, y: 56 },
    '"': { x: 56, y: 56 },
  },
}

export function SpriteText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const text = React.Children.toArray(children).join('')
  const lines = text.split(/\r\n|\n|\r/)

  return (
    <div className={cn('flex flex-col', className)}>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ').filter((word) => word.length > 0)

        return (
          <div
            key={`line-${lineIndex}`}
            className="flex flex-wrap gap-x-[1em] gap-y-[0.25em]"
          >
            {words.map((word, wordIndex) => (
              <div key={`word-${lineIndex}-${wordIndex}`} className="flex">
                {word.split('').map((char, charIndex) => {
                  const frame =
                    spriteSheetData.frames[char] || spriteSheetData.frames['?']

                  return (
                    <div
                      key={`${char}-${lineIndex}-${wordIndex}-${charIndex}`}
                      className="w-[1em] h-[1em] bg-no-repeat" // 8px = 1em at 8px font-size
                      style={{
                        backgroundImage: `url("/letters.png")`,
                        backgroundPosition: `-${frame.x / 8}em -${
                          frame.y / 8
                        }em`, // 8px = 1em
                        backgroundSize: `${128 / 8}em ${64 / 8}em`, // 96px = 12em
                      }}
                      aria-label={char}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
