import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

export type Project = {
  id: string;
  name: string;
  date: string;
  imageUri?: string;
};

export type Plan = {
  id: string;
  title: string;
  imageUri?: string;
};

type PlanData = {
  plans: Plan[];
  completedPlans: boolean[];
};

export type EvaluationData = {
  evaluations: Record<string, boolean | undefined>;
  newItems: string[];
  realPhotoUri: string | null;
};

export type EvaluationItem = {
  id: string;
  name: string;
  registered: boolean;
};

export type ProjectEvaluationSummary = {
  itemCount: number;
  falseCount: number;
  trueCount: number;
  newItemCount: number;
};

type PlanContextType = {
  // Project
  projects: Project[];

  addProject: (
    name: string,
    date: string,
    imageUri?: string,
  ) => void;

  // Plan
  plansByProject: Record<string, PlanData>;

  addPlan: (
    projectId: string,
    title: string,
    imageUri?: string,
  ) => void;

  togglePlan: (
    projectId: string,
    index: number,
  ) => void;

  getPlans: (
    projectId: string,
  ) => Plan[];

  getCompletedPlans: (
    projectId: string,
  ) => boolean[];

  // Evaluation
  evaluationsByPlan: Record<
    string,
    EvaluationData
  >;

  evaluationItems: EvaluationItem[];

  saveEvaluation: (
    projectId: string,
    planIndex: number,
    data: EvaluationData,
  ) => void;

  getEvaluation: (
    projectId: string,
    planIndex: number,
  ) => EvaluationData | undefined;

  getProjectEvaluationSummary: (
    projectId: string,
  ) => ProjectEvaluationSummary;

  toggleEvaluationItem: (
    itemId: string,
  ) => void;

  addEvaluationItem: (
    name: string,
  ) => void;
};

const initialEvaluationItems: EvaluationItem[] = [
  {
    id: "1",
    name: "景色",
    registered: true,
  },
  {
    id: "2",
    name: "混雑",
    registered: true,
  },
  {
    id: "3",
    name: "アクセス",
    registered: true,
  },
  {
    id: "4",
    name: "費用",
    registered: true,
  },
  {
    id: "5",
    name: "雰囲気",
    registered: true,
  },
];

const PlanContext =
  createContext<PlanContextType>({
    // Project
    projects: [],

    addProject: () => {},

    // Plan
    plansByProject: {},

    addPlan: () => {},

    togglePlan: () => {},

    getPlans: () => [],

    getCompletedPlans: () => [],

    // Evaluation
    evaluationsByPlan: {},

    evaluationItems:
      initialEvaluationItems,

    saveEvaluation: () => {},

    getEvaluation: () =>
      undefined,

    getProjectEvaluationSummary: () => ({
      itemCount: 0,
      falseCount: 0,
      trueCount: 0,
      newItemCount: 0,
    }),

    toggleEvaluationItem: () => {},

    addEvaluationItem: () => {},
  });

export function PlanProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ========================================
  // Project
  // ========================================

  const [projects, setProjects] =
    useState<Project[]>([]);

  const addProject = (
    name: string,
    date: string,
    imageUri?: string,
  ) => {
    const trimmedName = name.trim();
    const trimmedDate = date.trim();

    if (!trimmedName || !trimmedDate) {
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: trimmedName,
      date: trimmedDate,
      imageUri,
    };

    setProjects((current) => [
      ...current,
      newProject,
    ]);
  };

  // ========================================
  // Plan
  // ========================================

  const [
    plansByProject,
    setPlansByProject,
  ] = useState<
    Record<string, PlanData>
  >({});

  // ========================================
  // Evaluation
  // ========================================

  const [
    evaluationsByPlan,
    setEvaluationsByPlan,
  ] = useState<
    Record<string, EvaluationData>
  >({});

  const [
    evaluationItems,
    setEvaluationItems,
  ] = useState<EvaluationItem[]>(
    initialEvaluationItems,
  );

  // ========================================
  // Evaluation key
  // ========================================

  const getEvaluationKey = (
    projectId: string,
    planIndex: number,
  ) => {
    return `${projectId}-plan-${planIndex}`;
  };

  // ========================================
  // Plan追加
  // ========================================

  const addPlan = (
    projectId: string,
    title: string,
    imageUri?: string,
  ) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || !projectId) {
      return;
    }

    setPlansByProject((current) => {
      const currentProject =
        current[projectId] ?? {
          plans: [],
          completedPlans: [],
        };

      const newPlan: Plan = {
        id: Date.now().toString(),
        title: trimmedTitle,
        imageUri,
      };

      return {
        ...current,

        [projectId]: {
          plans: [
            ...currentProject.plans,
            newPlan,
          ],

          completedPlans: [
            ...currentProject.completedPlans,
            false,
          ],
        },
      };
    });
  };

  // ========================================
  // Plan完了状態切り替え
  // ========================================

  const togglePlan = (
    projectId: string,
    index: number,
  ) => {
    setPlansByProject((current) => {
      const currentProject =
        current[projectId];

      if (!currentProject) {
        return current;
      }

      return {
        ...current,

        [projectId]: {
          ...currentProject,

          completedPlans:
            currentProject.completedPlans.map(
              (completed, i) =>
                i === index
                  ? !completed
                  : completed,
            ),
        },
      };
    });
  };

  // ========================================
  // Plan取得
  // ========================================

  const getPlans = (
    projectId: string,
  ): Plan[] => {
    return (
      plansByProject[projectId]?.plans ??
      []
    );
  };

  // ========================================
  // Plan完了状態取得
  // ========================================

  const getCompletedPlans = (
    projectId: string,
  ): boolean[] => {
    return (
      plansByProject[projectId]
        ?.completedPlans ?? []
    );
  };

  // ========================================
  // 評価保存
  // ========================================

  const saveEvaluation = (
    projectId: string,
    planIndex: number,
    data: EvaluationData,
  ) => {
    const key = getEvaluationKey(
      projectId,
      planIndex,
    );

    setEvaluationsByPlan((current) => ({
      ...current,
      [key]: data,
    }));
  };

  // ========================================
  // 評価取得
  // ========================================

  const getEvaluation = (
    projectId: string,
    planIndex: number,
  ) => {
    const key = getEvaluationKey(
      projectId,
      planIndex,
    );

    return evaluationsByPlan[key];
  };

  // ========================================
  // プロジェクト全体の評価集計
  // ========================================

  const getProjectEvaluationSummary = (
    projectId: string,
  ): ProjectEvaluationSummary => {
    const plans =
      plansByProject[projectId]?.plans ??
      [];

    let itemCount = 0;
    let falseCount = 0;
    let trueCount = 0;
    let newItemCount = 0;

    plans.forEach(
      (_plan, planIndex) => {
        const key =
          getEvaluationKey(
            projectId,
            planIndex,
          );

        const evaluation =
          evaluationsByPlan[key];

        if (!evaluation) {
          return;
        }

        const values = Object.values(
          evaluation.evaluations,
        ).filter(
          (value) =>
            value !== undefined,
        );

        itemCount += values.length;

        falseCount += values.filter(
          (value) =>
            value === false,
        ).length;

        trueCount += values.filter(
          (value) =>
            value === true,
        ).length;

        newItemCount +=
          evaluation.newItems.length;
      },
    );

    return {
      itemCount,
      falseCount,
      trueCount,
      newItemCount,
    };
  };

  // ========================================
  // 評価項目の登録・解除
  // ========================================

  const toggleEvaluationItem = (
    itemId: string,
  ) => {
    setEvaluationItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              registered:
                !item.registered,
            }
          : item,
      ),
    );
  };

  // ========================================
  // 新しい評価項目を追加
  // ========================================

  const addEvaluationItem = (
    name: string,
  ) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setEvaluationItems((current) => {
      const exists = current.some(
        (item) =>
          item.name === trimmedName,
      );

      if (exists) {
        return current;
      }

      const newItem: EvaluationItem = {
        id: `custom-${Date.now()}-${current.length}`,
        name: trimmedName,
        registered: false,
      };

      return [
        ...current,
        newItem,
      ];
    });
  };

  // ========================================
  // Provider
  // ========================================

  return (
    <PlanContext.Provider
      value={{
        // Project
        projects,
        addProject,

        // Plan
        plansByProject,
        addPlan,
        togglePlan,
        getPlans,
        getCompletedPlans,

        // Evaluation
        evaluationsByPlan,
        evaluationItems,
        saveEvaluation,
        getEvaluation,
        getProjectEvaluationSummary,
        toggleEvaluationItem,
        addEvaluationItem,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlans() {
  return useContext(PlanContext);
}