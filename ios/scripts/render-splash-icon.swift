import AppKit
import CoreGraphics

private let background = NSColor(
  red: 0x1C / 255.0,
  green: 0x1B / 255.0,
  blue: 0x1F / 255.0,
  alpha: 1
)
private let surface = NSColor(
  red: 0x4F / 255.0,
  green: 0x37 / 255.0,
  blue: 0x8B / 255.0,
  alpha: 1
)
private let accent = NSColor(
  red: 0xD0 / 255.0,
  green: 0xBC / 255.0,
  blue: 0xFF / 255.0,
  alpha: 1
)

private func shieldPath() -> CGPath {
  let path = CGMutablePath()
  path.move(to: CGPoint(x: 79.993, y: 51.996))
  path.addCurve(
    to: CGPoint(x: 49.356, y: 87.793),
    control1: CGPoint(x: 79.993, y: 71.994),
    control2: CGPoint(x: 65.994, y: 81.993)
  )
  path.addCurve(
    to: CGPoint(x: 46.676, y: 87.753),
    control1: CGPoint(x: 48.356, y: 88.193),
    control2: CGPoint(x: 47.516, y: 88.173)
  )
  path.addCurve(
    to: CGPoint(x: 15.999, y: 51.996),
    control1: CGPoint(x: 30.32, y: 81.993),
    control2: CGPoint(x: 15.999, y: 70.236)
  )
  path.addLine(to: CGPoint(x: 15.999, y: 23.998))
  path.addCurve(
    to: CGPoint(x: 19.999, y: 19.998),
    control1: CGPoint(x: 15.999, y: 21.79),
    control2: CGPoint(x: 17.791, y: 19.998)
  )
  path.addCurve(
    to: CGPoint(x: 44.956, y: 9.119),
    control1: CGPoint(x: 27.998, y: 14.198),
    control2: CGPoint(x: 35.997, y: 9.119)
  )
  path.addCurve(
    to: CGPoint(x: 51.036, y: 9.119),
    control1: CGPoint(x: 46.956, y: 7.319),
    control2: CGPoint(x: 49.116, y: 7.319)
  )
  path.addCurve(
    to: CGPoint(x: 75.993, y: 19.998),
    control1: CGPoint(x: 58.035, y: 9.119),
    control2: CGPoint(x: 66.034, y: 14.198)
  )
  path.addCurve(
    to: CGPoint(x: 79.993, y: 23.998),
    control1: CGPoint(x: 78.201, y: 19.998),
    control2: CGPoint(x: 79.993, y: 21.79)
  )
  path.addLine(to: CGPoint(x: 79.993, y: 51.996))
  return path
}

private func renderSplashIcon(size: CGFloat) -> NSImage {
  let image = NSImage(size: NSSize(width: size, height: size))
  image.lockFocus()
  defer { image.unlockFocus() }

  guard let ctx = NSGraphicsContext.current?.cgContext else {
    return image
  }

  ctx.setFillColor(background.cgColor)
  ctx.fill(CGRect(x: 0, y: 0, width: size, height: size))

  let cornerRadius = size * (24.0 / 208.0)
  let boxPath = NSBezierPath(
    roundedRect: CGRect(x: 0, y: 0, width: size, height: size),
    xRadius: cornerRadius,
    yRadius: cornerRadius
  )
  surface.setFill()
  boxPath.fill()

  let shieldX = size * (63.0 / 208.0)
  let shieldY = size * (53.5 / 208.0)
  let scaleX = size * (82.0 / 208.0) / 96.0
  let scaleY = size * (101.0 / 208.0) / 96.0

  ctx.saveGState()
  ctx.translateBy(x: shieldX, y: shieldY + size * (101.0 / 208.0))
  ctx.scaleBy(x: scaleX, y: -scaleY)
  ctx.addPath(shieldPath())
  ctx.setStrokeColor(accent.cgColor)
  ctx.setLineWidth(6.0)
  ctx.setLineCap(.round)
  ctx.setLineJoin(.round)
  ctx.strokePath()
  ctx.restoreGState()

  return image
}

private func savePNG(_ image: NSImage, to path: String) throws {
  guard let tiff = image.tiffRepresentation,
        let rep = NSBitmapImageRep(data: tiff),
        let data = rep.representation(using: .png, properties: [:])
  else {
    throw NSError(domain: "render", code: 1)
  }
  try data.write(to: URL(fileURLWithPath: path))
}

let outDir = CommandLine.arguments[1]
try savePNG(renderSplashIcon(size: 208), to: "\(outDir)/splash-icon.png")
try savePNG(renderSplashIcon(size: 416), to: "\(outDir)/splash-icon@2x.png")
try savePNG(renderSplashIcon(size: 624), to: "\(outDir)/splash-icon@3x.png")
print("Rendered splash icons to \(outDir)")
