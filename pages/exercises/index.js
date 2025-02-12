import ExercisesList from "@/components/ExercisesList";
import FilterList from "@/components/FilterList";
import Login from "@/components/Login";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import SearchBar from "@/components/SearchBar";

export default function HomePage({ exercises, muscleGroups }) {
  const [filterMode, setFilterMode] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState(exercises);
  const [muscles, setMuscles] = useState(muscleGroups);
  const [searchInput, setSearchInput] = useState("");

  function handleShowFilter() {
    setFilterMode(!filterMode);
  }

  function handleSelect(muscleGroup) {
    if (!selectedMuscleGroups.includes(muscleGroup)) {
      const newSelectedMuscleGroups = [...selectedMuscleGroups, muscleGroup];
      setSelectedMuscleGroups(newSelectedMuscleGroups);

      setFilteredExercises(
        exercises.filter((exercise) =>
          newSelectedMuscleGroups.every((selectedMuscleGroup) =>
            exercise.muscleGroups.includes(selectedMuscleGroup)
          )
        )
      );

      setMuscles(muscles.filter((muscle) => muscle !== muscleGroup));
    }
  }

  function handleDeselect(muscleGroup) {
    const newSelectedMuscleGroups = selectedMuscleGroups.filter(
      (selectedMuscleGroup) => selectedMuscleGroup !== muscleGroup
    );
    setSelectedMuscleGroups(newSelectedMuscleGroups);

    setFilteredExercises(
      exercises.filter((exercise) =>
        newSelectedMuscleGroups.every((selectedMuscleGroup) =>
          exercise.muscleGroups.includes(selectedMuscleGroup)
        )
      )
    );

    const newMuscles = [...muscles, muscleGroup];
    newMuscles.sort((a, b) => a.localeCompare(b));
    setMuscles(newMuscles);
  }

  function handleClear() {
    setSelectedMuscleGroups([]);
    setFilteredExercises(exercises);
    setMuscles(muscleGroups);
  }

  const { data: session } = useSession();

  function handleSearch(input) {
    setSearchInput(input);
    const lowercasedInput = input.toLowerCase();
    const filtered = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(lowercasedInput)
    );
    setFilteredExercises(filtered);
  }

  return (
    <StyledSection>
      <HeadlineSection>
        {session ? (
          <H1>
            WELCOME TO YOUR <br />
            EXERCISE LIST, <Username>{session.user.name}</Username>!
          </H1>
        ) : (
          <H1>
            {" "}
            WELCOME TO YOUR <br />
            EXERCISE LIST
          </H1>
        )}
        <Login />
      </HeadlineSection>

      <ControlsContainer>
        <SearchBar searchInput={searchInput} onSearch={handleSearch} />
        <FilterButton type="button" onClick={handleShowFilter}>
          Filter ☰
        </FilterButton>
      </ControlsContainer>

      {filterMode ? (
        <FilterList
          muscleGroups={muscles}
          onSelect={handleSelect}
          selectedMuscleGroups={selectedMuscleGroups}
          onDeselect={handleDeselect}
          onClear={handleClear}
        />
      ) : null}
      <ExercisesList exercises={filteredExercises} />
    </StyledSection>
  );
}

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  width: 85vw;
  max-width: 1000px;
`;

const FilterButton = styled.button`
  border: none;
  background-color: orange;
  border-radius: 0.25rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  cursor: pointer;

  &:hover {
    background-color: darkorange;
  }
`;

const H1 = styled.h1`
  color: var(--dark-brown);
  font-size: xx-large;
  font-weight: normal;
  line-height: 1;
  margin-top: 0;
  max-width: 65%;
`;

const Username = styled.span`
  color: var(--dark-orange);
`;

const HeadlineSection = styled.section`
  width: 85vw;
  max-width: 1000px;
  margin: 2rem auto auto auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;
