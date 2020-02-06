export const mapJsonToKing = (json: any) => {
  return json.value.map(obj => {
    return {
      email: obj.RowKey,
      firstName: obj.FirstName,
      lastName: obj.LastName,
      penning: obj.Penning,
      lat: obj.lat,
      lon: obj.lon,
      XPGain: obj.XPGain
    };
  })[0];
};

export const mapJsonToUnits = (json: any) => {
  return json.value.map(obj => {
    return {
      id: obj.RowKey,
      firstName: obj.FirstName,
      lastName: obj.LastName,
      xp: obj.XP,
      level: obj.Level,
      rank: obj.Rank,
      dead: obj.Dead
    };
  });
};
