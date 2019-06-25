use super::types::{ Color, ColorSequence };

pub struct Sequencer {
    sequence: ColorSequence,
    len: usize
}

impl Sequencer {
    pub fn new(sequence: ColorSequence, len: usize) -> Sequencer {
        Sequencer {
            sequence,
            len
        }
    }

    pub fn get_color(&self, idx: usize) -> Color {
        if idx >= self.len {
            panic!("SEQUENCER_get_color: idx is out of bounds");
        }

        let section_length = (self.len / 2) as f64;
        let (lx, l, rx, r) = match idx as f64 >= section_length {
            false => (0 as f64 , self.sequence.0, section_length, self.sequence.1),
            true => (section_length, self.sequence.1, self.len as f64, self.sequence.2),
        };
        let x = idx as f64 - lx;

        (
            ((((r.0 - l.0) as f64 / rx - lx) * (x - lx)) + l.0 as f64) as u8,
            ((((r.1 - l.1) as f64 / rx - lx) * (x - lx)) + l.1 as f64) as u8,
            ((((r.2 - l.2) as f64 / rx - lx) * (x - lx)) + l.2 as f64) as u8
        )
    }
}

#[cfg(test)]
mod sequencer_test {
    use super::*;

    fn setup() -> Sequencer {
        Sequencer::new((
            (0, 0, 0),
            (16, 32, 64),
            (48, 96, 192)
        ), 5)
    }

    #[test]
    #[should_panic(expected = "SEQUENCER_get_color: idx is out of bounds")]
    fn get_color_oob() {
        assert_eq!(setup().get_color(5), (0, 0, 0));
    }

    #[test]
    fn get_color() {
        assert_eq!(setup().get_color(0), (0, 0, 0));
        assert_eq!(setup().get_color(1), (8, 16, 32));
        assert_eq!(setup().get_color(2), (16, 32, 64));
        assert_eq!(setup().get_color(3), (32, 64, 128));
        assert_eq!(setup().get_color(4), (48, 96, 192));
    }
}
