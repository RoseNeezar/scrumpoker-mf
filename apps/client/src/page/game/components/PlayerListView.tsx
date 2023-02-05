import { useGame } from "../../../store/useGame";

type Props = {};

const PlayerListView = (props: Props) => {
  const data = useGame();

  return (
    <>
      <div className="mt-10 overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Vote</th>
              <th>Leader</th>
            </tr>
          </thead>
          <tbody>
            {data.players.map((s, i) => {
              return (
                <tr key={s.id}>
                  <th>{i + 1}</th>
                  <td>{s.nickname}</td>
                  {s.vote === 0 ? (
                    <td></td>
                  ) : data.revealVote ? (
                    <td>{s.vote}</td>
                  ) : (
                    <td>?</td>
                  )}
                  {s.is_party_leader ? <td>Yes</td> : <td></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PlayerListView;
