export const siuColours = {
    black: "#262638",
    purple: "#414258",
    purple10: "#5B5C72",
    purple20: "#74758B",
    purple30: "#8E8FA5",
    teal: "#588D97",
    teal10: "#72A7B1",
    teal20: "#8BC0CA",
    teal30: "#A5DAE4",
    green: "#315259",
    green10: "#4B6C73",
    green20: "#64858C",
    green30: "#7E9FA6",
    orange: "#F47C20",
    orange10: "#FF963A",
    orange20: "#FFAF53",
    orange30: "#FFC96D",
    greyDark: "#BDBAC0",
    greyLight: "#D1D3D4"
};

export const roundUpToNearestFive = (n) => {
    return 5 * (Math.ceil(n / 5));;
};

export const formatNumberWithCommas = (n) => {
    var numberSegment = n.toString().split(".");
    numberSegment[0] = numberSegment[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return numberSegment.join(".");
}

export const linearRegression = (y, x) => {
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
        sum_yy += (y[i] * y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return lr;
}

export const setStorage = (data, name) => {
    let directorJSON = 
    {"children": [
        {
          "name": name,
          "children": [
            {
              "name": "Cast Unfamiliars",
              "group": "A",
              "value":(data.allCastmembersEver - data.familiarCastmembers),
              "colname": "level3"
            },
            {
              "name": "Cast Familiars",
              "group": "A",
              "value": data.familiarCastmembers,
              "colname": "level3"
            },
            {
              "name": "Crew Unfamiliars",
              "group": "A",
              "value": data.allCrewmembersEver - data.familiarCrewMembers,
              "colname": "level3"
            },        
            {
              "name": "Crew Familiars",
              "group": "A",
              "value": data.familiarCrewMembers,
              "colname": "level3"
            },
          ],
      }
    ]}
    return directorJSON 
}

export const appendStorage = (storage, data, name) => {
  let directorJSON =         {
          "name": name,
          "children": [
            {
              "name": "Cast Unfamiliars",
              "group": "A",
              "value":(data.allCastmembersEver - data.familiarCastmembers),
              "colname": "level3"
            },
            {
              "name": "Cast Familiars",
              "group": "A",
              "value": data.familiarCastmembers,
              "colname": "level3"
            },
            {
              "name": "Crew Unfamiliars",
              "group": "A",
              "value": data.allCrewmembersEver - data.familiarCrewMembers,
              "colname": "level3"
            },        
            {
              "name": "Crew Familiars",
              "group": "A",
              "value": data.familiarCrewMembers,
              "colname": "level3"
            },
          ],
      }
  storage['children'].push(directorJSON)
  return storage; 
}