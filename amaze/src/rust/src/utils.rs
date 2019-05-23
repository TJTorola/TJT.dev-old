fn clamp(i: usize, low: usize, high: usize) -> usize {
    if i < low {
        low
    } else if i >= high {
        high - 1
    } else {
        i
    }
}

fn randNum(to: usize) -> usize {
    (js_sys::Math::random() * to as f64) as usize
}

