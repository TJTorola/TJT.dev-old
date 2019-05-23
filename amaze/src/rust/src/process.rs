extern crate im;

use im::HashMap as ImHashMap;
use super::types::*;

pub struct Process {
  steps: Vec<(Diff, Map)>,
}

impl Process {
    pub fn new(init: Option<Map>) -> Process {
        let init = init.unwrap_or(ImHashMap::new());
        Process {
            steps: vec![(vec![], init)]
        }
    }

    pub fn get_top_map(&self) -> Map {
        let top = self.steps.get(self.steps.len() - 1).unwrap();
        top.1.clone()
    }

    pub fn get_map(&self, step_idx: usize) -> Option<Map> {
        match self.steps.get(step_idx) {
            Some(step) => Some(step.1.clone()),
            None => None,
        }
    }

    pub fn push(&mut self, changes: Vec<Change>) {
        let diff = changes.iter().map(|(coord, _)| {
            *coord
        }).collect();

        let map = changes.iter().fold(self.get_top_map(), |acc, (coord, color)| {
            acc.update(*coord, *color)
        });

        self.steps.push((diff, map));
    }

    pub fn len(&self) -> usize {
        self.steps.len()
    }

    pub fn get_diff(&self, from: usize, to: Option<usize>) -> Diff {
        if to.is_none() {
            match self.steps.get(from) {
                Some(step) => step.0.clone(),
                None => vec![],
            }
        } else {
            let to = to.unwrap();
            let low = std::cmp::min(to, from) + 1;
            let high = std::cmp::max(to, from);

            (low..=high).fold(vec![], |acc, idx| {
                match self.steps.get(idx) {
                    Some(step) => [&acc[..], &step.0[..]].concat(),
                    None => acc,
                }
            })
        }
    }
}
